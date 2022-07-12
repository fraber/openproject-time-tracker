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
    'TSTrack.controller.LoginPanelController',
    'TSTrack.controller.TimeEntryPanelController'
])

// Global (URL) path to where images are stored, used by image buttons etc.
var gifPath = 'images/';

// The actual application GUI with the main tab panel
function launchApplication() {
    // Main application panel with viewport and all the other panels
    var mainPanel = Ext.create('TSTrack.view.MainPanel');

    // Manually launch and attach the controllers to work around Ext.application quirks
    var loginPanelController = Ext.create('TSTrack.controller.LoginPanelController');
    // loginPanelController.init(this).onLaunch(this);
    var timeEntryPanelController = Ext.create('TSTrack.controller.TimeEntryPanelController');
    timeEntryPanelController.init(this).onLaunch(this);
}


// Setup stores before calling launchApplication
Ext.onReady(function() {
    var timeEntries = Ext.create('TSTrack.store.TimeEntries');

    var projects = Ext.create('TSTrack.store.Projects');
    projects.load();
    
    var workPackages = Ext.create('TSTrack.store.WorkPackages');
    launchApplication();
});
