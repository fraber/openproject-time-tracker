/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Main panel with tabbed panel container
 *
 *
 */
Ext.define('TSTrack.view.MainPanel', {
    alias:  'mainPanel',
    extend: 'Ext.container.Viewport',
    title: false,
    id: 'mainPanel',
    layout: 'fit',
    debug: 0,

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
                {xtype: 'button', id: 'buttonDel', icon: gifPath + 'delete.png', hidden: false}
            ]
        }
    }
});
