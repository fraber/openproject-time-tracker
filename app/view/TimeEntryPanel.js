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
                // Check values from the editor may cause "save" operations to fail.
                validateedit: function(editor, context, eOpts) {
                    var me = this;
                    if (me.debug) console.log('TimeEntryPanel.cellediting.validateedit');

                    // We use multiple fields with fieldId + fieldTitle,
                    // and we also want to set the fieldTitle when changing the fieldId.
                    var idField = context.field;
                    var lastTwoChars = idField.substring(idField.length - 2, idField.length);
                    if ("Id" == lastTwoChars) { // only use this for combinations of Id+Title
                        var baseField = idField.substring(0, idField.length - 2);
                        var titleField = baseField+"Title";
                        
                        var editor = context.column.getEditor();
                        var idValue = context.value;
                        var record = context.record;
                        var displayField = editor.displayField;
                        
                        var displayValue = editor.rawValue;
                        record.set(titleField, displayValue);
                    }
                    
                    return true;
                }
            }
        })
    ],

    columns: [
        {text: 'Id', dataIndex: 'id', align: 'right', width: 60, hidden: true},
        {text: 'Date', width: 80, dataIndex: 'spentOn',
         editor: {
             xtype: 'datefield',
             format : "Y-m-d",
             altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
             disabledDaysText : "Disabled",
             disabledDatesText : "Disabled",
             minText : "The date in this field must be equal to or after {0}",
             maxText : "The date in this field must be equal to or before {0}",
             invalidText : "{0} is not a valid date - it must be in the format {1}",
             triggerCls : Ext.baseCSSPrefix + 'form-date-trigger',
             showToday : true,
             initTime: '12', // 24 hour format
             initTimeFormat: 'H',
             matchFieldWidth: false,
             startDay: 0
         },
         renderer: function(v) {
             if (v instanceof Date) return Ext.Date.format(v, 'Y-m-d');
             return v;
         }
        },
        {text: 'Project', dataIndex: 'projectId', width: 80,
         editor: {
             xtype: 'combobox',
             store: 'Projects',
             displayField: 'name', valueField: 'id',
             queryMode: 'local',
             matchFieldWidth: false
         },
         renderer: function(v, el, model, col, row, timeEntriesStore, gridView) { return model.get('projectTitle'); }
        },

        {text: 'Work Package', dataIndex: 'workPackageId', width: 80,
         editor: {
             xtype: 'combobox',
             store: 'WorkPackages',
             displayField: 'name', valueField: 'id',
             queryMode: 'local',
             matchFieldWidth: false,
             listeners: {
                 activate: function() {
                     // alert('activate');
                 },
                 focus: function() {
                     // Send out an asynchroneous load() to WorkPackages
                     console.log('TimeEntryPanel.WorkPackages.expand: Started');

                     var workPackages = Ext.StoreManager.get('WorkPackages');
                     workPackages.getProxy().extraParams = {
                         pageSize: 1000,
                         filters: '[{"project":{"operator":"=","values":["14"]}}]'
                     };
                     workPackages.load({callback: function(r, op, success) { if (!success) alert('Store: WorkPackages load failed');}});
                     console.log('TimeEntryPanel.WorkPackages.expand: Started');
                 },
                 enable: function() {
                     // alert('enable');
                 },
                 expand: function() {
                     // alert('expand');
                 }
             }
         },
         renderer: function(v, el, model) { return model.get('workPackageTitle'); }
        },

        {text: 'Hours', dataIndex: 'hours', width: 80, editor: 'textfield'},
        {text: 'Comment', dataIndex: 'comment', flex: 5, editor: 'textfield'}


/*        
        {text: 'Name', dataIndex: 'name', flex: 5, editor: 'textfield'},

        // ToDo: Changing the date will set start to 00:00, so we have to override
        // the save method of the editor and add the start _time_ to it.

        {text: 'Start', width: 60, dataIndex: 'start',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },

        {text: 'End', width: 60, dataIndex: 'end',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },
*/
    ]
});
