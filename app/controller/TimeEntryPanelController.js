/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Handle user interactions in the TimeEntryPanel
 *
 * - We need to enable/disable the add/del buttons depending
 *   on the type of line currently selected
*/
Ext.define('TSTrack.controller.TimeEntryPanelController', {
    extend: 'Ext.app.Controller',
    id: 'timeEntryPanelController',

    refs: [
        { ref: 'mainPanel', selector: '#mainPanel'},
        { ref: 'tabPanel', selector: '#tabPanel'},
        { ref: 'loginPanel', selector: '#panel #login'},
        { ref: 'timeEntryPanel', selector: '#timeEntryPanel'},
        { ref: 'buttonAdd', selector: '#buttonAdd'},
        { ref: 'buttonDel', selector: '#buttonDel'},
    ],

    controllers: {},	// List of controllers, setup during init

    // This is called before the viewport is created
    init: function() {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.init:');

        this.control({
            '#timeEntryPanel editor': { change: function() { alert('change'); } },
        });

        this.control({
            '#tabPanel': { tabchange: this.onTabChanged },
            '#timeEntryPanel': {
                aftercelledit: this.onAfterCellEdit,
                beforecelledit: this.onBeforeCellEdit
            },
            '#buttonAdd': { click: this.onButtonAdd },
            '#buttonDel': { click: this.onButtonDel }
        });
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.onLaunch:');
        return this;
    },

    // "We" (the TimeEntry panel) got activated via tab
    onTabChanged: function(tabPanel, newCard, oldCard, eOpts) {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.onTabChanged: ' + newCard.title);

        // Show new and del buttons when selecting this tab
        if (newCard == me.getTimeEntryPanel()) {
            me.getButtonAdd().show();
            me.getButtonDel().show();
        }

        // Hide buttons again if we get deselected
        if (oldCard == me.getTimeEntryPanel()) {
            me.getButtonAdd().hide();
            me.getButtonDel().hide();
        }

    },

    /**
     * Create a new TimeEntry model at the top of the list,
     * copying data from the currently selected (last) entry
     */
    onButtonAdd: function() {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.onButtonAdd: Starting');

        var timeEntryPanel = me.getTimeEntryPanel();
        var timeEntries = timeEntryPanel.getStore();
        var rowEditing = timeEntryPanel.plugins[0];
        rowEditing.cancelEdit();

        // Find the lastSelected entry to serve as a template for the new one
        var selectionModel = timeEntryPanel.getSelectionModel();
        var lastSelected = selectionModel.getLastSelected();
        selectionModel.deselectAll();
        // If nothing was selected by the user, then take the top one in the list
        if (!lastSelected) lastSelected = timeEntries.first(); // may be undefined right after launch
        if (!lastSelected) {	// very unfortunate, let's create a new one to avoid hard failures
            lastSelected = Ext.create('TSTrack.model.TimeEntry');
        }

        // Cleanup/update the template data of the lastSelected without changing lastSelected
        var lastData = lastSelected.getData();
        delete lastData.id;
        delete lastData.createdAt;
        delete lastData.updatedAt;
        lastData['hours'] = ""; // no hours logged yet
        lastData['comment'] = ""; // no comment yet
        lastData['spentOn'] = new Date().toISOString().substring(0,10); // today
        lastData['start'] = "";
        lastData['end'] = "";

        // Auxillary functionality to create fake data entries
	if (false) {
            var h = Math.floor(Math.random() * 80.0) / 10.0;
            lastData['hours'] = "PT"+Math.floor(h)+"H"+Math.floor(60.0 * (h-Math.floor(h)))+"M";
            lastData['comment'] = randWords(8);
            lastData['spentOn'] = randDate(new Date("2022-08-15"), new Date());
	}
        
        // create new entry based on template data
        // var t = Ext.create('TSTrack.model.TimeEntry', lastData);
        var t = Ext.create('TSTrack.model.TimeEntry');
        t.set(lastData);

        var added = timeEntries.insert(0, t); // add at the very top of the list (newest)
        // don't save the entry yet.
        // onCellChange below will handle that once we had got some real data.

        // Re-sort store after insert
        timeEntries.sort();
        
        if (me.debug > 0) console.log ('TimeEntryPanelController.onButtonAdd: Finished');
        // if (me.debug > 0) console.log(timeEntries.debugStoreValues());
    },

    onButtonDel: function() {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.onButtonDel:');

        var timeEntryPanel = me.getTimeEntryPanel();
        var rowEditing = timeEntryPanel.plugins[0];
        rowEditing.cancelEdit();

        var store = timeEntryPanel.getStore();
        var selectionModel = timeEntryPanel.getSelectionModel();
        var lastSelected = selectionModel.getLastSelected();
        if (!lastSelected) return;

        // Find the next model below lastSelected
        var idx = store.find('id', lastSelected.get('id'));
        var nextSelected = store.getAt(idx+1);
        if (nextSelected) {
            selectionModel.select(nextSelected)
        }

        store.remove(lastSelected); // Remove triggers destroy using the proxy of the store
        if (me.debug > 0) console.log(store.debugStoreValues());
    },

    /**
     * Load the work packages of project projectId into the WorkPackages store.
     */
    loadProjectWorkPackages: function(projectId, callback) {
        var me = this;

        var workPackages = Ext.StoreManager.get('WorkPackageStore');
        var lastProjectId = workPackages.lastProjectId;
        if (lastProjectId && lastProjectId == projectId) return; // skip if already loaded

        var filters = '[{"project":{"operator":"=","values":["'+projectId+'"]}}]';
        var controllers = me.controllers;
        var configData = controllers.loginPanelController.configData;
        workPackages.loadWithAuth(configData, filters, callback);

        workPackages.lastProjectId = projectId; // save, acts like a cache
    },


    onBeforeCellEdit: function(cellediting, editor, context, eOpts) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryPanelController.onBeforeCellEdit: Starting');
        
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
            var configData = controllers.loginPanelController.configData;
            workPackageStore.loadWithAuth(configData, filters);
        }
    },
    
    /**
     * Some of the cells in the Grid have changed.
     * e: {
     * - grid - The grid
     * - record - The record that was edited
     * - field - The field name that was edited
     * - value - The value being set
     * - originalValue - The original value for the field, before the edit.
     * - row - The grid table row
     * - column - The grid {@link Ext.grid.column.Column Column} defining the column that was edited.
     * - rowIdx - The row index that was edited
     * - colIdx - The column index that was edited
     * }
     */
    onAfterCellEdit: function(cellEditing, e) {
        var me = this;
        if (me.debug > 0) { console.log('TimeEntryPanelController.onCellChange:'); console.log(e); }

        switch (e.field) {
        case 'projectId':
            me.onProjectChange(e, cellEditing);
            break;
        case 'workPackageId':
            me.onWorkPackageChange(e, cellEditing);
            break;
        }

        // Common to all cells: Save the model if valid.
        //
        // There is an exception for projectId, because a change in projectId
        // will force the user to also select the work_package_id, so don't save.
        if ('projectId' == e.field && e.originalValue !== e.value) {
            return;
        }

        // Check if e.record is "valid" (suitable for the OpenProject API to digest)
        // This avoids errors from the back-end.
        var errors = e.record.validate();
        var isValid = (errors.length == 0); // e.record.isValid();
        if (isValid) {
            // "Sync" the current store with the back-end:
            // create, update and delete in one command
            var store = e.record.store;
            var syncOptions = {
                success: function(batch, options) {
                    if (me.debug > 5) console.log('callback: TimeEntryPanelController.onCellChange.Sync.success:');
                },
                failure: function(batch, options) {
                    var msgs = [];
                    Ext.each(batch.exceptions, function(operation) {
                        if (operation.hasException()) {
                            if (me.debug > 0) console.log('Sync.failure: ' + operation.error.statusText);
                            msgs.push(operation.error.statusText);
                        }
                    });
                    if (msgs.length > 0) {
                        var msg = msgs.join("\r\n");
                        console.error('TimeEntryPanelController.onCellChange.sync.failure: Sync failed: '+msg);
                        Ext.Msg.alert('Sync with OpenProject failed', 'Message from server:<br><pre>'+msg+'</pre>');
                    } else {
                        console.error('TimeEntryPanelController.onCellChange.sync.failure: Sync failed.');
                    }
                }
            };

	    // Sorting the store after every change cross the grid,
	    // moving the current entry possibly out of the viewport.
            // store.sort();
            store.sync(syncOptions);
        }
        
    },
    /**
     * projectId has changed: 
     * - Write projectTitle into model (used for display rendering)
     * - Invalidate the workpackage
     */
    onProjectChange: function(e, cellEditing) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryPanelController.onProjectChange: projectId');

        // Write projectTitle into model (used for display rendering)
        var projectStore = Ext.StoreManager.get('ProjectStore');
        var projectId = e.value;
        var projectName = projectStore.projectNameFromId(projectId);
        e.record.set('projectTitle', projectName);

        // Load the WP store for the new project
        callback = function(r, op, success) {
            if (me.debug > 0) console.log('callback: TimeEntryPanelController.onProjectChange: projectId');
            
            if (!success) {
                var errorMsg = op.error.statusText;
                Ext.Msg.alert('Loading WorkPackages', 'Message from server:<br><pre>'+errorMsg+'</pre>');
            }
            if (success) {
                // So we just have successfully loaded the WorkPackageStore from the
                // OpenProject backend, because the user has changed the project.
                // The user now has to choose a new WP within this store.
                // - We store the first WP into the new record as a default.
                // - We start editing the WP field to save the user the Tab key or click.
                // - We also want to open the picker with the list of WPs
                var firstModel = r[0];
                if (!firstModel) return;		// Skip the rest for projects without WPs

                // Write the first WP into the model as a default.
                // Otherwise the WP would be from a project that's not the one in the model
                var id = firstModel.get('id');
                var title = firstModel.get('subject');
                e.record.set('workPackageId', id);
                e.record.set('workPackageTitle', title);

/*
                // This code leads to an error when _clicking_ into the next column after changing 
                // the project. Maybe catch the case of changing between columns by clicking?

                // Search for WorkPackage column
                var wpColumn = null;
                var grid = cellEditing.grid;
                for(var i = 0; i < grid.columns.length; i++) {
                    if (grid.columns[i].dataIndex == 'workPackageId')
                        wpColumn = grid.columns[i];
                }

                // Start editing with the WorkPackage field
                var wpEditor = wpColumn.editor;
                cellEditing.startEdit(e.record, wpColumn);
*/
            }
        };
        me.loadProjectWorkPackages(projectId, callback);
    },


    /**
     * workPackageId has changed: 
     * - Write workPackageTitle into model
     */
    onWorkPackageChange: function(e, cellEditing) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryPanelController.onWorkPackageChange: projectId');

        // Write workPackageTitle into model (used for display rendering)
        var workPackageStore = Ext.StoreManager.get('WorkPackageStore');
        var title = workPackageStore.workPackageNameFromId(e.value);
        e.record.set('workPackageTitle', title);        
    }
});
