/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * GridPanel with TimeEntries with editing and endless scrolling
 */
Ext.define('TSTrack.view.TimeEntryPanel', {
    alias:  'timeEntryPanel',
    extend: 'Ext.grid.Panel',
    title: 'Time Entry',
    id: 'timeEntryPanel',
    debug: 0,

    store: 'TimeEntries',
    emptyText: 'No time entries available',

    // Enable in-line editing
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                // Veto editing for certain columns and rows
                beforeedit: function(editor, context, eOpts) {
                    var me = this;
                    if (me.debug) console.log('TimeEntryPanel.cellediting.beforeedit');
                    return true;
                },
                // Invalid values values from the editor may cause "save" operations to fail.
                validateedit: function(editor, context, eOpts) {
                    var me = this;
                    if (me.debug) console.log('TimeEntryPanel.cellediting.validateedit');
                    return true;
                }
            }
        })
    ],

    columns: [
        {text: 'Id', dataIndex: 'id', align: 'right', width: 20, hidden: true},
        
        {text: 'Project', dataIndex: 'project_id', width: 80,
         editor: {
             xtype: 'combobox',
             store: 'Projects',
             displayField: 'name', valueField: 'id',
             queryMode: 'local',
             matchFieldWidth: false
         },
         renderer: function(v) {
             projectStore = Ext.StoreManager.get('Projects');
             idx = projectStore.find('id', v)
             model = projectStore.getAt(idx);
             return model.get('name');
         }
        },
       
        {text: 'Work Package', dataIndex: 'work_package_id', width: 80,
         editor: {
             xtype: 'combobox',
             store: 'WorkPackages',
             displayField: 'name', valueField: 'id',
             queryMode: 'local',
             matchFieldWidth: false
         },
         renderer: function(v) {
             wpStore = Ext.StoreManager.get('WorkPackages');
             idx = wpStore.find('id', v)
             model = wpStore.getAt(idx);
             return model.get('name');
         }
        },
       
        {text: 'Name', dataIndex: 'name', flex: 5, editor: 'textfield'},

        // ToDo: Changing the date will set start to 00:00, so we have to override
        // the save method of the editor and add the start _time_ to it.
        {text: 'Date', width: 80, dataIndex: 'start',
         editor: 'datefield',
         renderer: function(v) { return Ext.Date.format(v, 'Y-m-d'); }
        },

        {text: 'Start', width: 60, dataIndex: 'start',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },

        {text: 'End', width: 60, dataIndex: 'end',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },

        {text: 'Note', dataIndex: 'note', flex: 5, editor: 'textfield'}
    ]
});
