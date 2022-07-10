/*
 * OpenProject Timesheet Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 */

// Load Electron inter process communication (IPC)
const {ipcRenderer} = require('electron')

// Tell ExtJS where to load classes and which
Ext.Loader.setPath('TSTrack', '.');
Ext.Loader.setConfig({disableCaching: false});
Ext.require([
    'Ext.*',
    'TSTrack.model.TimeEntry',
    'TSTrack.model.Project',
    
    'TSTrack.store.TimeEntries',
    'TSTrack.store.Projects',

    'TSTrack.view.AboutPanel',
    'TSTrack.view.LoginPanel',
    'TSTrack.view.TimeEntryPanel'
])

var node_version = process.versions.node;
var chrome_version = process.versions.chrome;
var electron_version = process.versions.electron;
var extjs_version = Ext.getVersion().version;

var gifPath = 'images/';

// Background color to help identify the layout of the views
var bg_colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff" ];


// The actual application GUI with the main tab panel
function launchApplication() {    
    var mainPanel = Ext.create('Ext.container.Viewport', {
        title: false,
        id: 'mainPanel',
        layout: 'fit',
        items: {
            xtype: 'tabpanel',
            id: 'tabPanel',
            layout: 'fit',
            items: [
                Ext.create('TSTrack.view.LoginPanel'),
                Ext.create('TSTrack.view.TimeEntryPanel'),
                Ext.create('TSTrack.view.AboutPanel')
            ],
            tabBar: {
                items: [
                    {xtype: 'tbfill' },
                    {xtype: 'button', id: 'buttonAdd', icon: gifPath + 'add.png', hidden: true},
                    {xtype: 'button', id: 'buttonDel', icon: gifPath + 'delete.png', hidden: true}
                ]
            }
        }
    });
}


// Setup stores before calling launchApplication
Ext.onReady(function() {
    var timeEntries = Ext.create('TSTrack.store.TimeEntries');
    var projects = Ext.create('TSTrack.store.Projects');
    var workPackages = Ext.create('TSTrack.store.WorkPackages');
    launchApplication();
});
