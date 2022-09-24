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
    store: 'TimeEntryStore',
    emptyText: 'No time entries available',
    hidden: true, // Hide this tab initially, show after login

    debug: 0,
    controllers: {},

    // Enable in-line editing. This is a customized version of CellEditing
    // that issues custom events before and after editing a cell for the
    // controller to handle reloading stores when projects change.
    plugins: [Ext.create('TSTrack.view.TimeEntryCellEditing')],

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
        {   text: 'Project', dataIndex: 'projectId', width: 100,
            editor: {
                xtype: 'combobox',
                store: 'ProjectStore',
                displayField: 'name', valueField: 'id',
                queryMode: 'local',
                forceSelection: true,
                matchFieldWidth: false,
                // The listeners for this field are defined in CellEditor,
		// because there is no model available when fired from here.
            },
            renderer: function(v, el, model) { return model.get('projectTitle'); }
        },

        {   text: 'Work Package', dataIndex: 'workPackageId', width: 120,
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

/*
        // Need to implement ActivityStore and load per project similar to WPs(?)
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

        // 0.4.0: Need to implement start-stop
        {   text: 'Start', width: 60, dataIndex: 'start',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },
        {   text: 'End', width: 60, dataIndex: 'end',
         editor: {xtype: 'timefield', format: 'H:i', increment: 60},
         renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
        },
*/

        {   text: 'Hours', dataIndex: 'hours', width: 40,
	    align: "right",
	    editor: {
		xtype: 'timeEntryField',   // sub-type fo numberfield
		minValue: 0,
		maxValue: 99,
		step: 1,
		hideTrigger: true,
		debug: this.debug
	    },
            renderer: function(v, el, model) {
		var hours = TSTrack.view.TimeEntryField.durationToHours(v);
		return ""+hours;
	    }
	},

        {   text: 'Comment', dataIndex: 'comment', flex: 5, editor: 'textfield'}
    ]
});
