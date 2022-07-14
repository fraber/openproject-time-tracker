/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 */

/* ToDo:
- Login page
        - Get token from OpenProject
        - Somehow get the current user's ID
- Create new entries
- Fix grid fields
        - Date field doesn't work yet
        - Project field doesn't get all 57 projects - deal with pagination
        - Don't write TimeEntry.updatedAt to server
        - Show PT5H as 5 hours...
        - Load work packages per project on-demand
        - New field activty "activity" : { "href" : "/api/v3/time_entries/activities/9", "title" : "Development" }
- Write data back to server
        - Write comment with format: plain and html: "<p>...plain...</p>"
        - Delete data on server
          "delete" : { "href" : "/api/v3/time_entries/27157", "method" : "delete" },
          "updateImmediately" : { "href" : "/api/v3/time_entries/27157", "method" : "patch" },
          "update" : { "href" : "/api/v3/time_entries/27157/form", "method" : "post" },
- Make grid a grouped grid with groupings as TimeEntries
  and details as TimeIntervalEntries
- Do interval logging with break detection
- Other:
       - Make Electron font bigger and prettier
       - Update to newer version of Electron
       - Create Electron Windows installer
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

    // Manually launch and attach the controllers to work around Ext.application quirks
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
            'Projects',
            'TimeEntries'
        ],
        listeners: {
            load: function() {
                if ("boolean" == typeof this.loadedP) { return; }               // Check if the application was launched before
                launchApplication(debug);                                       // Launch the actual application.
                this.loadedP = true;                                            // Mark the application as launched
            }
        }
    });

    // Load the stores
    timeEntries.load({callback: function(r, op, success) {if (!success) alert('Store: TimeEntries load failed');}});
    projects.load({callback: function(r, op, success) {if (!success) alert('Store: Projects load failed');}});
    workPackages.load({callback: function(r, op, success) { if (!success) alert('Store: WorkPackages load failed');}});
});




