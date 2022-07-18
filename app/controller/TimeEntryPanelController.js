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
                selectionchange: this.onSelectionChange,
                projectchange: this.onProjectChange
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

    // Create a new TimeEntry model at the top of the list,
    // copying data from the currently selected (last) entry
    onButtonAdd: function() {
        console.log ('TimeEntryPanelController.onButtonAdd:');
        var me = this;
        
        var timeEntryPanel = me.getTimeEntryPanel();
        var timeEntries = timeEntryPanel.getStore();
        var rowEditing = timeEntryPanel.plugins[0];
        rowEditing.cancelEdit();

        var selectionModel = timeEntryPanel.getSelectionModel();
        var lastSelected = selectionModel.getLastSelected();
        selectionModel.deselectAll();
        if (!lastSelected) lastSelected = timeEntries.first(); // may be undefined right after launch
        if (!lastSelected) {
            lastSelected = Ext.create('TSTrack.model.TimeEntry');
        }

        var lastData = lastSelected.getData();
        delete lastData.id;
        delete lastData.createdAt;
        delete lastData.updatedAt;
        lastData['spentOn'] = new Date().toISOString().substring(0,10); // today
        lastData['start'] = "";
        lastData['end'] = "";
        
        var t = Ext.create('TSTrack.model.TimeEntry', lastData);
        timeEntries.insert(0, t);
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

        lastSelected.remove(); // Check if that works with store

    },

    /**
     * Load the work packages of project projectId into the WorkPackages store.
     */
    loadProjectWorkPackages: function(projectId) {
        var me = this;
        
        var workPackages = Ext.StoreManager.get('WorkPackages');
        var lastProjectId = workPackages.lastProjectId;
        if (lastProjectId && lastProjectId == projectId) return; // skip if already loaded
        
        var filters = '[{"project":{"operator":"=","values":["'+projectId+'"]}}]';
        var controllers = me.controllers;
        var configData = controllers.loginPanelController.configData;
        workPackages.loadWithAuth(configData, filters);

        workPackages.lastProjectId = projectId; // save, acts like a cache
    },

    /**
     * A user has modified the project in some editor.
     * So let's load the work packages for that project.
     */
    onProjectChange: function(field) {
        var me = this;
        console.log('TimeEntryPanelController.onProjectChange:');
        var projectId = field.getValue();
        me.loadProjectWorkPackages(projectId);
    },

    /**
     * The user has selected a different row.
     * Let's already now start loading the work packages for the project
     * referenced in this row.
     */
    onSelectionChange: function(rowModel, selectedEntries, event) {
        var model = selectedEntries[0]; if (!model) return;
        var projectId = model.get('projectId'); if (!projectId) return;
        this.loadProjectWorkPackages(projectId);
    }

});
