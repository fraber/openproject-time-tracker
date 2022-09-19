/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 */

// Load Electron inter process communication (IPC)
const {ipcRenderer} = require('electron')

// Tell ExtJS to load user classes
Ext.Loader.setPath('TSTrack', '.');
Ext.Loader.setConfig({disableCaching: false});
Ext.require([
    'Ext.*',

    'TSTrack.custom.OpenProjectReader',
    'TSTrack.custom.OpenProjectWriter',
    
    'TSTrack.model.TimeEntry',
    'TSTrack.model.Project',
    'TSTrack.model.WorkPackage',

    'TSTrack.store.OpenProjectStore',
    'TSTrack.store.TimeEntryStore',
    'TSTrack.store.ProjectStore',
    'TSTrack.store.WorkPackageStore',

    'TSTrack.view.AboutPanel',
    'TSTrack.view.LoginPanel',
    'TSTrack.view.TimeEntryPanel',
    'TSTrack.view.TimeEntryField',
    
    'TSTrack.controller.IpcController',
    'TSTrack.controller.StoreLoadCoordinator',
    'TSTrack.controller.LoginPanelController',
    'TSTrack.controller.TimeEntryPanelController'
])

// Global path to where images are stored, used by image buttons etc.
var gifPath = 'images/';
var controllers = null;

// Global functions to extract parts of JSON
// ToDo: Move to Reader or similar object
var globalFromJsonLastPathSegment = function(str) {
    if (!str) return null;
    if ("string" != typeof(str)) {
        console.log('globalFromJsonLastPathSegment: found non-string argument');
        console.log(str);
        return null;
    }
    var pieces = str.split("/");
    return pieces[pieces.length-1]
};

// The actual application GUI with the main tab panel
function launchApplication(debug) {
    // Create 
    var projectStore = Ext.StoreManager.get('ProjectStore');
    var timeEntrieStore = Ext.StoreManager.get('TimeEntryStore');
    var workPackageStore = Ext.StoreManager.get('WorkPackageStore');

    // Main application panel with viewport and all the other panels
    var mainPanel = Ext.create('TSTrack.view.MainPanel');

    // Manually launch controllers to work around Ext.application quirks
    var ipcController = Ext.create('TSTrack.controller.IpcController');
    ipcController.init(this);
    var loginPanelController = Ext.create('TSTrack.controller.LoginPanelController');
    loginPanelController.init(this);
    var timeEntryPanelController = Ext.create('TSTrack.controller.TimeEntryPanelController');
    timeEntryPanelController.init(this);

    // Create global list of controllers before launching them
    controllers = {
        ipcController: ipcController,
        loginPanelController: loginPanelController,
        timeEntryPanelController: timeEntryPanelController
    };
    ipcController.controllers = controllers;
    loginPanelController.controllers = controllers;
    timeEntryPanelController.controllers = controllers;
    
    // Now launching the controllers:
    ipcController.onLaunch(this);
    loginPanelController.onLaunch(this);
    timeEntryPanelController.onLaunch(this);
}

/**
 * Setup stores before calling launchApplication
 */
Ext.onReady(function() {
    Ext.QuickTips.init(); // No idea why this is necessary, but it seems to be...
    var debug = 0;

    // Setup stores but don't load them yet. Loading happens after login.
    var projectStore = Ext.create('TSTrack.store.ProjectStore');
    var timeEntrieStore = Ext.create('TSTrack.store.TimeEntryStore');
    var workPackageStore = Ext.create('TSTrack.store.WorkPackageStore');
    
    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);
});




