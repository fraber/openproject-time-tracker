/*
 * OpenProject Timesheet Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 *
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * This is application for the Electron "renderer" process.
 * This script requires Sencha Ext/JS 4.2.1
 */

// Load Electron inter process communication (IPC)
const {ipcRenderer} = require('electron')

Ext.Loader.setPath('TSTrack', '.');
Ext.Loader.setConfig({disableCaching: false});

Ext.require([
    'Ext.*',
    'TSTrack.model.TimeEntry',
    'TSTrack.store.TimeEntries',
    'TSTrack.view.AboutPanel',
    'TSTrack.view.LoginPanel',
    'TSTrack.view.TimeEntryPanel'
])

var node_version = process.versions.node;
var chrome_version = process.versions.chrome;
var electron_version = process.versions.electron;
var extjs_version = Ext.getVersion().version;

// Background color to help identify the layout of the views
var bg_colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff" ];

/************************************************************
 *
 * GUI
 *
 ************************************************************/

function set_defaults (level, opts) {
    /* set to true(false) to enable(disable) coloured layouts */
    if (false) {
        if (!opts) opts = {};
        opts.style = {
            margin: '2px',
            padding: '2px',
            border: '1px solid black',
            background: bg_colors[level % 6],
        };
    }
    return opts;
}

// The actual application GUI
function launchApplication() {    
    var mainPanel = Ext.create('Ext.container.Viewport', {
        title: false,
        id: 'mainPanel',
        layout: 'fit',
        items: { // The viewport contains the main tabPanel with the various tabs.
            xtype: 'tabpanel',
            id: 'tabPanel',
            layout: 'fit',
            defaults: set_defaults(1, {layout: 'fit', defaults: set_defaults(2)}),
            items: [
                Ext.create('TSTrack.view.LoginPanel'),
                Ext.create('TSTrack.view.TimeEntryPanel'),
                Ext.create('TSTrack.view.AboutPanel')
            ]
        }
    });
} // launchApplication


// Setup stores before calling launchApplication
Ext.onReady(function() {
    var timeEntriesStore = Ext.create('TSTrack.store.TimeEntries');    
    launchApplication();
});
