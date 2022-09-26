/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 */

const {ipcRenderer} = require('electron'); // Electron inter process communication

// Tell ExtJS to load user classes
Ext.Loader.setPath('TSTrack', '.');	// Load classes TSTrack.x.y from local dir
Ext.Loader.setConfig({disableCaching: false}); // Allow caching and persistent breakpoints
Ext.require([
    'Ext.*',				// ExtJS core library, just load everything

    'TSTrack.custom.OpenProjectReader',	// Custom adapters for OpenProject REST API
    'TSTrack.custom.OpenProjectWriter',

    'TSTrack.model.TimeEntry',		// An actual time entry
    'TSTrack.model.Project',		// Projects are containers for WorkPackages
    'TSTrack.model.WorkPackage',	// WP == Task, this is where to book hours

    'TSTrack.store.OpenProjectStore',	// Superclass for all stores, handles auth
    'TSTrack.store.TimeEntryStore',	// Time entries
    'TSTrack.store.ProjectStore',	// Projects are WP containers
    'TSTrack.store.WorkPackageStore',	// Hours are booked on WPs
    'TSTrack.store.BarChartStore',	// Aggregration of hours per day and project

    // GUI panels that will appear as tabs in MainPanel.js
    'TSTrack.view.AboutPanel',		// Simple panel with static HTML
    'TSTrack.view.LoginPanel',		// Form with login fields
    'TSTrack.view.TimeEntryPanel',	// Grid with list of time entries
    'TSTrack.view.BarChartPanel',	// Bar chart
    'TSTrack.view.TimeEntryField',	// Editor to handle PTxxHyyM time format

    'TSTrack.view.TimeEntryCellEditing',
    
    'TSTrack.controller.MainPanelController',	// Handle changing tabs
    'TSTrack.controller.IpcController',	// Electron inter-process communication
    'TSTrack.controller.StoreLoadCoordinator',	// Load stores before starting GUI
    'TSTrack.controller.LoginPanelController',	// Handle login process
    'TSTrack.controller.TimeEntryPanelController' // Manage the time entry process
])

var gifPath = 'images/';	// Global path for images, buttons etc.
var controllers = {};		// Global list of controllers,
                                      // word around quirk in Ext.Application


// Setup functionality to create mock data
var randWordData = [
    "a", "about", "all", "an", "and", "are", "as", "at", "be", "been", "but", "by", "call", "can",
    "come", "could", "day", "did", "do", "down", "each", "find", "first", "for", "from", "get", "go",
    "had", "has", "have", "he", "her", "him", "his", "how", "i", "if", "in", "into", "is", "it", "its", "like",
    "long", "look", "made", "make", "many", "may", "more", "my", "no", "not", "now", "number", "of",
    "oil", "on", "one", "or", "other", "out", "part", "people", "said", "see", "she", "so", "some",
    "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "time", "to",
    "two", "up", "use", "was", "water", "way", "we", "were", "what", "when", "which", "who", "will",
    "with", "word", "would", "write", "you", "your"
];
function randWord() { return randWordData[Math.floor(Math.random() * randWordData.length)] + " "; };
function randWords(n) { r = ""; for(var i= 0; i < n; i++) r = r + randWord(); return r; }
function randDate(start, end) { var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); return d.toISOString().substring(0,10); };

/*
 * The actual application GUI with the main tab panel
 */
function launchApplication(debug) {

    // Main application panel with viewport.
    // Will instantiate and load all other panels as tabs.
    var mainPanel = Ext.create('TSTrack.view.MainPanel', {
            debug: debug,
        controllers: controllers
    });

    // Manually launch controllers to work around Ext.application quirks
    var ipcController = Ext.create('TSTrack.controller.IpcController');
    var loginPanelController = Ext.create('TSTrack.controller.LoginPanelController');
    var timeEntryPanelController = Ext.create('TSTrack.controller.TimeEntryPanelController');
    var mainPanelController = Ext.create('TSTrack.controller.MainPanelController');

    // init is executed before panels 
    ipcController.init(this);
    loginPanelController.init(this);
    timeEntryPanelController.init(this);
    mainPanelController.init(this);

    controllers = {    // List of all controllers before launching panels
        ipcController: ipcController,
        loginPanelController: loginPanelController,
        timeEntryPanelController: timeEntryPanelController,
        mainPanelController: mainPanelController
    };
    ipcController.controllers = controllers;
    loginPanelController.controllers = controllers;
    timeEntryPanelController.controllers = controllers;
    mainPanelController.controllers = controllers;
    
    // Now launch the controllers
    ipcController.onLaunch(this);
    loginPanelController.onLaunch(this);
    timeEntryPanelController.onLaunch(this);
    mainPanelController.onLaunch(this);

    // At this point the LoginPanel and the About Panels are visible.
    // The LoginPanelController will take over and load various stores
    // and activate the rest of the application once the necessary
    // credentials are there.
}

/**
 * Setup stores before calling launchApplication
 */
Ext.onReady(function() {
    Ext.QuickTips.init();               // No idea why this is necessary, but it is.
    var debug = 5;                      // 0 = silent, 5 = normal dev, 9 = verbose

    // Setup stores but don't load them yet. Loading happens after login.
    var projectStore = Ext.create('TSTrack.store.ProjectStore');
    var timeEntrieStore = Ext.create('TSTrack.store.TimeEntryStore');
    var workPackageStore = Ext.create('TSTrack.store.WorkPackageStore');

    // Normally we would start a StoreLoadCoordinator here,
    // but it seems to be OK without it.
    
    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);
});
