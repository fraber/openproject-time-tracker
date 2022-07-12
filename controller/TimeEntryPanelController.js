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
            '#tabPanel': { tabchange: this.onTabChanged },
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
        var rowEditing = timeEntryPanel.plugins[0];
        rowEditing.cancelEdit();

        var selectionModel = timeEntryPanel.getSelectionModel();
        var lastSelected = selectionModel.getLastSelected();
        var entryDefaults = {}
        if (lastSelected) {
            entryDefaults = {
	        project_id: t.get('project_id'),
                work_package_id: t.get('work_package_id'),
                start: t.get('start'),
                end: t.get('end')
            }
        }        
        var t = Ext.create('TSTrack.model.TimeEntry', entryDefaults);
        var store = timeEntryPanel.getStore();
        // store.insert(0, t);
        store.add(t);
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

    }
});
