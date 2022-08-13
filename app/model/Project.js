/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Data related to a project
 *
 */
Ext.define('TSTrack.model.Project', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'parent_id', type: 'int' },
        { name: 'identifier', type: 'string' },
        { name: 'name', type: 'string' }

/* No need to get the status of a project at the moment
        // _links: status: { href: "/api/v3/project_statuses/on_track", title: "On Track" }
        {
            name: 'statusId',
            type: 'auto',
            jsonMapping: '_links.status.href',
            toJsonFn: function(pid) {
                return "/api/v3/project_statuses/"+pid;
            },
            fromJsonFn: function(str) {
                var pieces = str.split("/");
                return pieces[pieces.length-1]
            }
        },
        {
            name: 'statusTitle',
            type: 'string',
            jsonMapping: '_links.status.title'
        }
*/
    ]
});
