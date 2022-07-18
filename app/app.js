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
    // 'TSTrack.custom.OpenProjectWriter',
    
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
    
    'TSTrack.controller.IpcController',
    'TSTrack.controller.StoreLoadCoordinator',
    'TSTrack.controller.LoginPanelController',
    'TSTrack.controller.TimeEntryPanelController'
])

// Global path to where images are stored, used by image buttons etc.
var gifPath = 'images/';

// The actual application GUI with the main tab panel
function launchApplication(debug) {
    // Create 
    var projects = Ext.StoreManager.get('ProjectStore');
    var timeEntries = Ext.StoreManager.get('TimeEntryStore');
    var workPackages = Ext.StoreManager.get('WorkPackageStore');

    // Main application panel with viewport and all the other panels
    var mainPanel = Ext.create('TSTrack.view.MainPanel');

    // Manually launch controllers to work around Ext.application quirks
    var ipcController = Ext.create('TSTrack.controller.IpcController');
    ipcController.init(this);
    var loginPanelController = Ext.create('TSTrack.controller.LoginPanelController');
    loginPanelController.init(this);
    var timeEntryPanelController = Ext.create('TSTrack.controller.TimeEntryPanelController');
    timeEntryPanelController.init(this);

    var controllers = {
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
    var projects = Ext.create('TSTrack.store.ProjectStore');
    var timeEntries = Ext.create('TSTrack.store.TimeEntryStore');
    var workPackages = Ext.create('TSTrack.store.WorkPackageStore');
    
    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);
});




