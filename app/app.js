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
    
    'TSTrack.model.TimeEntry',
    'TSTrack.model.Project',

    'TSTrack.store.TimeEntries',
    'TSTrack.store.Projects',

    'TSTrack.view.AboutPanel',
    'TSTrack.view.LoginPanel',
    'TSTrack.view.TimeEntryPanel',
    
    'TSTrack.controller.IpcController',
    'TSTrack.controller.StoreLoadCoordinator',
    'TSTrack.controller.LoginPanelController',
    'TSTrack.controller.TimeEntryPanelController'
])

// Global (URL) path to where images are stored, used by image buttons etc.
var gifPath = 'images/';

// The actual application GUI with the main tab panel
function launchApplication(debug) {
    var projects = Ext.StoreManager.get('Projects');
    var timeEntries = Ext.StoreManager.get('TimeEntries');
    var workPackages = Ext.StoreManager.get('WorkPackages');

    // Main application panel with viewport and all the other panels
    var mainPanel = Ext.create('TSTrack.view.MainPanel');

    // Manually launch controllers to work around Ext.application quirks

    // Inter-Process Controller - Handle communication with Electron
    // Doesn't do much at the moment...
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


// Setup stores before calling launchApplication
Ext.onReady(function() {
    Ext.QuickTips.init();                                                       // No idea why this is necessary, but it is...
    // Ext.getDoc().on('contextmenu', function(ev) { ev.preventDefault(); });   // Disable Right-click context menu on browser background
    var debug = 0;

    // Setup stores
    var projects = Ext.create('TSTrack.store.Projects');
    var timeEntries = Ext.create('TSTrack.store.TimeEntries');
    var workPackages = Ext.create('TSTrack.store.WorkPackages');

    // Load the stores
    // timeEntries.load({callback: function(r, op, success) {if (!success) alert('Store: TimeEntries load failed');}});
    // projects.load({callback: function(r, op, success) {if (!success) alert('Store: Projects load failed');}});
    // workPackages.load({callback: function(r, op, success) { if (!success) alert('Store: WorkPackages load failed');}});
    
    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);
});




