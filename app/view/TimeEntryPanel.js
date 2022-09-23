/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * GridPanel with TimeEntries with editing and endless scrolling
 */

/*
 * We need to handle the events before and after modifying
 * cells in order to load the options store for WorkPackges etc.
 */
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    pluginId: 'cellediting',
    clicksToEdit: 1,
    debug: 5,
    controllers: {},

    listeners: {
        /**
         * Prepare the WorkPackage editor for editing the specific entry,
         * Veto editing for certain columns and rows.
         */
        beforeedit: function(editor, context, eOpts) {
            var me = this;
            if (me.debug > 0) console.log('TimeEntryPanel.cellediting.beforeedit');
            var record = context.record;
            var projectId = record.get('projectId');
            var editor = context.column.getEditor();

	    // Load the list of work package belonging to the line's project
            var workPackageStore = Ext.StoreManager.get('WorkPackageStore');
            if (workPackageStore.projectId !== projectId) {
                workPackageStore.removeAll();
                workPackageStore.projectId = projectId;

                // Setup store with one entry {wpId: wpTitle} from TimeEntry model
                var wpData = {
                    _type: 'WorkPackage',
                    id: record.get('workPackageId'),
                    subject: record.get('workPackageTitle')
                };
                var wp = Ext.create('TSTrack.model.WorkPackage', wpData);
                workPackageStore.add(wp);
                workPackageStore.loadWith

                var filters = '[{"project":{"operator":"=","values":["'+projectId+'"]}}]';
		if (me.debug > 0) console.log(controllers);
                var configData = controllers.loginPanelController.configData;
                workPackageStore.loadWithAuth(configData, filters);

            }
            // not necessary anymore, editor works with store anyway:
            // editor.bindStore(workPackageStore);
            return true;
        },

        // After an edit: forward event to controller if something changed
        edit: function(cellEditing, e) {
            var me = this;
            if (e.value === e.originalValue) return; // Skip if nothing has changed...

	    // This is the only way to pass cellChange to controller...
            var grid = e.grid;
            grid.fireEvent('cellchange', cellEditing, e);
        }
    }

});


Ext.define('TSTrack.view.TimeEntryPanel', {
    alias:  'timeEntryPanel',
    extend: 'Ext.grid.Panel',
    title: 'Time Entry',
    id: 'timeEntryPanel',
    store: 'TimeEntryStore',
    emptyText: 'No time entries available',
    hidden: true, // Hide this tab initially, show after login

    debug: 0,
    controllers: {},
   
    plugins: [cellEditing],    // Enable in-line editing

    columns: [
        {   text: 'Id', dataIndex: 'id', align: 'right', width: 40, hidden: true},
        {   text: 'Date', width: 80, dataIndex: 'spentOn',
            editor: {
                xtype: 'datefield',
                format : "Y-m-d",
                altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
                disabledDaysText : "Disabled",
                disabledDatesText : "Disabled",
                invalidText : "{0} is not a valid date - it must be in the format {1}",
                matchFieldWidth: false,
                startDay: 1
            },
            renderer: function(v, meta) {
                // meta.style = "border: 1px solid red;"; // show a red border if wrong
                if (v instanceof Date) return Ext.Date.format(v, 'Y-m-d');
                return v;
            }
        },
        {   text: 'Project', dataIndex: 'projectId', width: 80,
            editor: {
                xtype: 'combobox',
                store: 'ProjectStore',
                displayField: 'name', valueField: 'id',
                queryMode: 'local',
                forceSelection: true,
                matchFieldWidth: false,
                // listeners are defined in CellEditor, because there is no model here
            },
            renderer: function(v, el, model) { return model.get('projectTitle'); }
        },

        {   text: 'Work Package', dataIndex: 'workPackageId', width: 80,
            editor: {
                xtype: 'combobox',
                store: 'WorkPackageStore',
                displayField: 'subject', valueField: 'id',
                queryMode: 'local',
                forceSelection: true,
                matchFieldWidth: false
            },
            renderer: function(v, el, model) { return model.get('workPackageTitle'); } 
        },

/* Need to implement ActivityStore and load per project similar to WPs(?)
        {   text: 'Activity', dataIndex: 'activityId', width: 80,
         editor: {
             xtype: 'combobox',
             store: 'ActivityStore',
             displayField: 'subject', valueField: 'id',
             queryMode: 'local',
             matchFieldWidth: false
         },
         renderer: function(v, el, model) { return model.get('activityTitle'); }
        },
*/

        {   text: 'Hours', dataIndex: 'hours', width: 80,
	    align: "right",
	    editor: {
		xtype: 'timeEntryField',   // sub-type fo numberfield
		minValue: 0,
		maxValue: 99,
		step: 1,
		hideTrigger: false
	    },
            renderer: function(v, el, model) {
		var hours = TSTrack.view.TimeEntryField.durationToHours(v);
		return ""+hours;
	    }
	},

        {   text: 'Comment', dataIndex: 'comment', flex: 5, editor: 'textfield'}

/*        
        {   text: 'Name', dataIndex: 'name', flex: 5, editor: 'textfield'},
        // ToDo: Changing the date will set start to 00:00, so we have to override
        // the save method of the editor and add the start _time_ to it.
        {   text: 'Start', width: 60, dataIndex: 'start',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },
        {   text: 'End', width: 60, dataIndex: 'end',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },
*/
    ]
});
