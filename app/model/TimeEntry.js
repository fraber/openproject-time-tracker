/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Data related to a time entry
 *
 */
Ext.define('TSTrack.model.TimeEntry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: '_type', type: 'string' },
        
        { name: 'spentOn', type: 'string' },
        { name: 'hours', type: 'string' },
	
        { name: 'createdAt', type: 'date' },
        { name: 'updatedAt', type: 'date' },

	{ name: 'start', type: 'date' },
        { name: 'end', type: 'date' },

	// comment: { format: "plain", html: "blabla", raw: "blablub" }
        {
	    name: 'comment',
	    type: 'string',
	    jsonMapping: 'comment',
	    toJsonFn: function(com) { return "{format: \"plain\", html: \""+com+"\", raw: \""+com+"\"}"; },
	    fromJsonFn: function(obj) { return obj.raw; }
	},

	// activity: { href: "/api/v3/time_entries/activities/9", title: "Development" }
        {
	    name: 'activityId',
	    type: 'int',
	    jsonMapping: '_links.activity.href',
	    toJsonFn: function(id) { return "/api/v3/time_entries/activities/"+id; },
	    fromJsonFn: globalFromJsonLastPathSegment
	},
        {
	    name: 'activityTitle',
	    type: 'string',
	    jsonMapping: '_links.activity.title'
	},

	// project: { href: "/api/v3/projects/14", title: "OpenProject" }
        {
	    name: 'projectId',
	    type: 'int',
	    jsonMapping: '_links.project.href',
	    toJsonFn: function(id) { return "/api/v3/projects/"+id; },
	    fromJsonFn: globalFromJsonLastPathSegment
	},
        {
	    name: 'projectTitle',
	    type: 'string',
	    jsonMapping: '_links.project.title'
	},

	// workPackage: { href: "/api/v3/work_packages/41530", title: "Copy a project shall also copy file_link" }
        {
	    name: 'workPackageId',
	    type: 'int',
	    jsonMapping: '_links.workPackage.href',
	    toJsonFn: function(id) { return "/api/v3/work_packages/"+id; },
	    fromJsonFn: globalFromJsonLastPathSegment
	},
        {
	    name: 'workPackageTitle',
	    type: 'string',
	    jsonMapping: '_links.workPackage.title'
	}
    ]
});
