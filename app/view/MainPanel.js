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
        activeTab: 0,
        layout: 'fit',
        items: [
            Ext.create('TSTrack.view.LoginPanel'),
            Ext.create('TSTrack.view.TimeEntryPanel'),
            Ext.create('TSTrack.view.AboutPanel')
        ],
        tabBar: {
            items: [
                {xtype: 'tbfill' },
                {xtype: 'button', id: 'buttonDebug', icon: gifPath + 'bug.png', hidden: false},
                {xtype: 'button', id: 'buttonSave', icon: gifPath + 'disk.png', hidden: false},
                {xtype: 'button', id: 'buttonReload', icon: gifPath + 'arrow_refresh.png', hidden: false},
                {xtype: 'button', id: 'buttonAdd', icon: gifPath + 'add.png', hidden: false},
                {xtype: 'button', id: 'buttonDel', icon: gifPath + 'delete.png', hidden: false}
            ]
        }
    }
});
