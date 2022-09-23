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
        {
	    name: 'id',
	    type: 'int',
	    jsonMapping: 'id',
	    toJsonFn: function(v) {
		// Don't create JSON for an id=0 (new object)
		if (v == 0) return null;
		return v;
	    }
	},
        { name: '_type', type: 'string' },
        
        {
            name: 'spentOn',
            type: 'date',
            jsonMapping: 'spentOn',
            toJsonFn: function(d) {
                return Ext.Date.format(d, 'Y-m-d');
            },
            fromJsonFn: function(dobj) {
                return new Date(dobj);
            }
            
        },
        { name: 'hours', type: 'string' },
/*        
        { name: 'createdAt', type: 'date' },
        { name: 'updatedAt', type: 'date' },
*/
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' },

        // comment: { format: "plain", html: "blabla", raw: "blablub" }
        {
            name: 'comment',
            type: 'string',
            jsonMapping: 'comment',
            toJsonFn: function(com) {
		return {format: "plain", html: com, raw: com};
		return "{\"format\": \"plain\", \"html\": \""+com+"\", \"raw\": \""+com+"\"}";
	    },
            fromJsonFn: function(obj) {
		return obj.raw;
	    }
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
    ],

    /**
     * These validations are not used by forms or similar.
     * Instead Model.validate() is called manually in
     * CellSelectionModel.onCellChange in order to check if
     * the user has finished editing the entry so that it
     * can be saved.
     */
    validations: [
        {type: 'presence', field: 'spentOn'},
        {type: 'presence', field: 'hours'},
        {type: 'format',   field: 'hours', matcher: /^PT[0-9]+.*/},
        {type: 'presence', field: 'activityId'},
        {type: 'presence', field: 'projectId'},
        {type: 'presence', field: 'workPackageId'}
    ]
});
