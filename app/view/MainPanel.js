/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Main panel with tabbed panel container
 */
Ext.define('TSTrack.view.MainPanel', {
    id: 'mainPanel',
    alias:  'mainPanel',
    extend: 'Ext.container.Viewport',	// Viewport is the main visible window
    title: false,
    layout: 'fit',
    debug: 0,
    controllers: {},			// Global list of controllers, work around quirk

    items: {				// There is only one TabPanel in the Viewport
        xtype: 'tabpanel',		// Panel with tabs for sub-panels
        id: 'tabPanel',
        activeTab: 0,
        layout: 'fit',
        items: [			// Hard-coded list of panels, add new panels here.
            Ext.create('TSTrack.view.LoginPanel', {debug: this.debug}),	    // Handle login
            Ext.create('TSTrack.view.TimeEntryPanel', {debug: this.debug}), // Show grid with time entries
	    Ext.create('TSTrack.view.AboutPanel', {debug: this.debug})	    // About the project
        ],
        tabBar: {			// Button bar to the right of the tabs
            items: [
                {xtype: 'tbfill' },	// keep distance to tabs
                {xtype: 'button', id: 'buttonDebug', icon: gifPath + 'bug.png', hidden: false},
                {xtype: 'button', id: 'buttonSave', icon: gifPath + 'disk.png', hidden: false},
                {xtype: 'button', id: 'buttonReload', icon: gifPath + 'arrow_refresh.png', hidden: false},
                {xtype: 'button', id: 'buttonAdd', icon: gifPath + 'add.png', hidden: false},
                {xtype: 'button', id: 'buttonDel', icon: gifPath + 'delete.png', hidden: false}
            ]
        }
    }
});
