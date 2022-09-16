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

    // This is called before the viewport is created
    init: function() {
        console.log ('TimeEntryPanelController.init:');

        this.control({
            '#timeEntryPanel editor': { change: function() { alert('change'); } },
        });

        this.control({
            '#tabPanel': { tabchange: this.onTabChanged },
            '#timeEntryPanel': {
                cellchange: this.onCellChange
            },
            '#buttonAdd': { click: this.onButtonAdd },
            '#buttonDel': { click: this.onButtonDel }
            // ToDo: Click in empty field -> new entry
        });
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        console.log ('TimeEntryPanelController.onLaunch:');
        return this;
    },

    // "We" (the TimeEntry panel) got activated via tab
    onTabChanged: function(tabPanel, newCard, oldCard, eOpts) {
        console.log ('TimeEntryPanelController.onTabChanged: ' + newCard.title);
        var me = this;

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
        console.log ('TimeEntryPanelController.onButtonAdd: Starting');
        var me = this;

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

        // create new entry based on template data
        var t = Ext.create('TSTrack.model.TimeEntry', lastData);
        var added = timeEntries.insert(0, t); // add at the very top of the list (newest)
        // don't save the entry yet.
        // onCellChange below will handle that once we had got some real data.

        console.log ('TimeEntryPanelController.onButtonAdd: Finished');
        // console.log(timeEntries.debugStoreValues());
    },

    onButtonDel: function() {
        console.log ('TimeEntryPanelController.onButtonDel:');
        var me = this;

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
        console.log(store.debugStoreValues());
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
    onCellChange: function(cellEditing, e) {
        var me = this;
        console.log('TimeEntryPanelController.onCellChange:'); console.log(e);

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

        var errors = e.record.validate();
        var isValid = (errors.length == 0); // e.record.isValid();
        if (isValid) {
            var store = e.record.store;
            var syncOptions = {
                success: function(batch, options) {
                    console.log('callback: TimeEntryPanelController.onCellChange.Sync.success:');
                    // alert('sync success');
                },
                failure: function(batch, options) {
                    console.log('callback: TimeEntryPanelController.onCellChange.Sync.failure:');
                    var msgs = [];
                    Ext.each(batch.exceptions, function(operation) {
                        if (operation.hasException()) {
                            console.log('Sync.failure: ' + operation.error.statusText);
                            msgs.push(operation.error.statusText);
                        }
                    });
                    if (msgs.length > 0) {
                        Ext.Msg.alert('Synchronization failed', 'Message from server:<br><pre>'+msgs.join("\r\n")+'</pre>');
                    }
                }
            };
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
        console.log('TimeEntryPanelController.onProjectChange: projectId');

        // Write projectTitle into model (used for display rendering)
        var projectStore = Ext.StoreManager.get('ProjectStore');
        var projectId = e.value;
        var projectName = projectStore.projectNameFromId(projectId);
        e.record.set('projectTitle', projectName);

        // Load the WP store for the new project
        callback = function(r, op, success) {
            console.log('callback: TimeEntryPanelController.onProjectChange: projectId');
            
            if (!success)
                alert('Store '+me.storeId+' load failed'); // ToDo: replace with Ext.Message
            if (success) {

                // Set the workPackageId and Title to the first element in the workPackageStore
                // var firstModel = r.getAt(0);
                var firstModel = r[0];
                if (!firstModel) return;

                // Invalidate the workpackage
                var id = firstModel.get('id');
                var title = firstModel.get('subject');
                e.record.set('workPackageId', id);
                e.record.set('workPackageTitle', title);
                return;
                
                
                // ToDo: open the ComboBox once the store is there
                console.log(e);
                var combo = null;
                // alert('xxx');
                
                var column = e.column;
                var ed = cellEditing.getEditor(e.record, column);
                var field = ed.field;

                var v = field.getValue();
                console.log(v);

                field.setEditable(true);
                field.expand(); // show the picker
                field.reset();
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
        console.log('TimeEntryPanelController.onWorkPackageChange: projectId');

        // Write workPackageTitle into model (used for display rendering)
        var workPackageStore = Ext.StoreManager.get('WorkPackageStore');
        var title = workPackageStore.workPackageNameFromId(e.value);
        e.record.set('workPackageTitle', title);        
    }
});
