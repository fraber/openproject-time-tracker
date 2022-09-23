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

    // GUI panels that will appear as tabs in MainPanel.js
    'TSTrack.view.AboutPanel',		// Simple panel with static HTML
    'TSTrack.view.LoginPanel',		// Form with login fields
    'TSTrack.view.TimeEntryPanel',	// Grid with list of time entries
    'TSTrack.view.TimeEntryField',	// Editor to handle PTxxHyyM time format
    
    'TSTrack.controller.IpcController',	// Electron inter-process communication
    'TSTrack.controller.StoreLoadCoordinator',	// Load stores before starting GUI
    'TSTrack.controller.LoginPanelController',	// Handle login process
    'TSTrack.controller.TimeEntryPanelController' // Manage the time entry process
])

var gifPath = 'images/';	// Global path for images, buttons etc.
var controllers = {};		// Global list of controllers,
    		  		// word around quirk in Ext.Application

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

    // init is executed before panels 
    ipcController.init(this);
    loginPanelController.init(this);
    timeEntryPanelController.init(this);

    controllers = {    // List of all controllers before launching panels
        ipcController: ipcController,
        loginPanelController: loginPanelController,
        timeEntryPanelController: timeEntryPanelController
    };
    ipcController.controllers = controllers;
    loginPanelController.controllers = controllers;
    timeEntryPanelController.controllers = controllers;
    
    // Now launch the controllers
    ipcController.onLaunch(this);
    loginPanelController.onLaunch(this);
    timeEntryPanelController.onLaunch(this);
}

/**
 * Setup stores before calling launchApplication
 */
Ext.onReady(function() {
    Ext.QuickTips.init();		// No idea why this is necessary, but it is.
    var debug = 5;	  		// 0 = silent, 5 = normal dev, 9 = verbose

    // Setup stores but don't load them yet. Loading happens after login.
    var projectStore = Ext.create('TSTrack.store.ProjectStore');
    var timeEntrieStore = Ext.create('TSTrack.store.TimeEntryStore');
    var workPackageStore = Ext.create('TSTrack.store.WorkPackageStore');

    // Normally we would start a StoreLoadCoordinator here,
    // but it seems to be OK without it.
    
    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);
});
