/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for Projects
 */
Ext.define('TSTrack.store.ProjectStore', {
    storeId: 'ProjectStore',
    extend: 'TSTrack.store.OpenProjectStore',
    model: 'TSTrack.model.Project',
    autoSync: false,

    proxy: {
        type: 'ajax',
	// Use endpoint for projects with permission to log hours
	// instead of '/api/v3/projects' for the standard list
        urlPath: '/api/v3/time_entries/available_projects',
        reader: {type: 'openProjectReader'},
        writer: {type: 'json'}
    },

    projectNameFromId: function(projectId) {
	var me = this;
	var idx = me.find('id', projectId);
	var project = me.getAt(idx);
	if (project) return project.get('name');
	return "undefined";
    }

});
