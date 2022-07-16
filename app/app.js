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

openproject_token = "YXBpa2V5OjBiNGMxZjY2MTljNGFiM2U4YWMyYzIwMDdiNTlkYzNlYzE4ZGY5ZGYwYjJlMmM3MmUwMTNjZGQ4YWM5NTIwMWM=";

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
    ipcController.init(this).onLaunch(this);

    var loginPanelController = Ext.create('TSTrack.controller.LoginPanelController');
    // loginPanelController.init(this).onLaunch(this);
    var timeEntryPanelController = Ext.create('TSTrack.controller.TimeEntryPanelController');
    timeEntryPanelController.init(this).onLaunch(this);
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

    // Store Coodinator starts app after all stores have been loaded:
    var ganttCoordinator = Ext.create('TSTrack.controller.StoreLoadCoordinator', {
        debug: debug,
        stores: [
            'Projects',                                                       // We don't need the projects for the drop-down when launching...
            'TimeEntries'
        ],
        listeners: {
            load: function() {
                if ("boolean" == typeof this.loadedP) { return; }               // Check if the application was launched before
  //              launchApplication(debug);                                       // Launch the actual application.
                this.loadedP = true;                                            // Mark the application as launched
            }
        }
    });

    // Load the stores
    timeEntries.load({callback: function(r, op, success) {if (!success) alert('Store: TimeEntries load failed');}});
    projects.load({callback: function(r, op, success) {if (!success) alert('Store: Projects load failed');}});
    // workPackages.load({callback: function(r, op, success) { if (!success) alert('Store: WorkPackages load failed');}});

    // Launch application without waiting for StoreLoadCoordinator
    launchApplication(debug);                                       // Launch the actual application.
});




