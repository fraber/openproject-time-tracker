/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Special version of the CellEditing grid plugin that passes
 * cell events to the controller.
 */
Ext.define('TSTrack.view.TimeEntryCellEditing', {
    alias:  'timeEntryCellEditing',
    extend: 'Ext.grid.plugin.CellEditing',
    id: 'timeEntryCellEditing',
    pluginId: 'cellediting',
    clicksToEdit: 1,

    debug: 0,

    listeners: {
        /**
         * Prepare the WorkPackage editor for editing the specific entry,
         * Veto editing for certain columns and rows.
         */
        beforeedit: function(editor, context, eOpts) {
            var me = this;
            if (me.debug > 0) console.log('CellEditing.beforeedit');

	    // Create a new type of event for controller to listen.
	    // This is the only way to pass beforeCellEdit events to the controller.
            var grid = me.grid;
            grid.fireEvent('beforecelledit', me, editor, context, eOpts);

            // not necessary anymore, editor works with store anyway:
            // editor.bindStore(workPackageStore);
            return true;
        },

        // After an edit: forward event to controller if something changed
        edit: function(cellEditing, e) {
            var me = this;
            if (me.debug > 0) console.log('CellEditing.edit');
            if (e.value === e.originalValue) return; // Skip if nothing has changed...

	    // Create a new type of event here.
	    // This is the only way to pass cellChange events to the controller.
            var grid = e.grid;
            grid.fireEvent('aftercelledit', cellEditing, e);
        }
    }

});
