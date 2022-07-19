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
        'id',
        '_type',
        
        'hours',
        'spentOn',

        'comment', // { format: "plain", html: "blabla", raw: "blablub" }
        'activityId', // { href: "/api/v3/time_entries/activities/9", title: "Development" }
        'activityTitle',
        'userId', // { href: "/api/v3/users/74087", title: "Frank Bergmann" }
        'userTitle',
        'projectId', // { href: "/api/v3/projects/14", title: "OpenProject" }
        'projectTitle',
        'workPackageId', // { href: "/api/v3/work_packages/41530", title: "Copy a project shall also copy file_link" }
        'workPackageTitle',
        
        'createdAt',
        'updatedAt',

        '_links.project.href',
        '_links.project.title',
        // '_links.user.href',
        // '_links.user.title',
        '_links.activity.href',
        '_links.activity.title',

        'work_package_id',
        'start',
        'end',
        'name',
        'note'
    ]
});

/*
            "_links" : {
               "user" : {
                  "href" : "/api/v3/users/74087",
                  "title" : "Frank Bergmann"
               },
               "project" : {
                  "href" : "/api/v3/projects/14",
                  "title" : "OpenProject"
               }
            }
*/
