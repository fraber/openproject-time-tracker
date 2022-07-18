/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Data related to a work package
 *
 */
Ext.define('TSTrack.model.WorkPackage', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',                           // "id":34,
        '_type',                        //
        'subject',                      // "subject":"Start of project",
        'date',
        'description',                  // "description":{"format":"markdown","raw":"","html":""},

        'createdAt',
        'updatedAt',

        'percentageDone',               // "percentageDone":0,
        'estimatedTime',                // "estimatedTime":null,
        'spentTime',                    // "spentTime":"PT0S",

        'typeId',                       // "type":{"href":"/api/v3/types/9","title":"Milestone"},
        'typeTitle',
        'statusId',
        'statusTitle',
        'priorityId',
        'priorityTitle',
        'projectId',
        'projectTitle',

        // Users related to the WP
        'authorId',
        'authorTitle',
        'responsibleId',
        'responsibleTitle',
        'assigneeId',
        'assigneeTitle',
    ]
});
        
/* {
    "spentTime":"PT0S",
    "laborCosts":"0.00 EUR",
    "materialCosts":"0.00 EUR",
    "overallCosts":"0.00 EUR",
    "_type":"WorkPackage",
    "id":34,
    "lockVersion":0,
    "subject":"Start of project",
    "description":{"format":"markdown","raw":"","html":""},
    "scheduleManually":false,
    "date":"2022-02-04",
    "estimatedTime":null,
    "derivedEstimatedTime":null,
    "ignoreNonWorkingDays":true,
    "percentageDone":0,
    "createdAt":"2022-02-01T12:04:07Z",
    "updatedAt":"2022-02-01T12:04:07Z",
    "_links":{
        "attachments":{"href":"/api/v3/work_packages/34/attachments"},
        "addAttachment":{"href":"/api/v3/work_packages/34/attachments","method":"post"},
        "fileLinks":{"href":"/api/v3/work_packages/34/file_links"},
        "addFileLink":{"href":"/api/v3/work_packages/34/file_links","method":"post"},
        "self":{"href":"/api/v3/work_packages/34","title":"Start of project"},
        "update":{"href":"/api/v3/work_packages/34/form","method":"post"},
        "schema":{"href":"/api/v3/work_packages/schemas/3-9"},
        "updateImmediately":{"href":"/api/v3/work_packages/34","method":"patch"},
        "delete":{"href":"/api/v3/work_packages/34","method":"delete"},
        "logTime":{"href":"/api/v3/time_entries","title":"Log time on Start of project"},
        "move":{"href":"/work_packages/34/move/new","type":"text/html","title":"Move Start of project"},
        "copy":{"href":"/work_packages/34/copy","title":"Copy Start of project"},
        "pdf":{"href":"/work_packages/34.pdf","type":"application/pdf","title":"Export as PDF"},
        "atom":{"href":"/work_packages/34.atom","type":"application/rss+xml","title":"Atom feed"},
        "availableRelationCandidates":{"href":"/api/v3/work_packages/34/available_relation_candidates","title":"Potential work packages to relate to"},
        "customFields":{"href":"/projects/demo-project/settings/custom_fields","type":"text/html","title":"Custom fields"},
        "configureForm":{"href":"/types/9/edit?tab=form_configuration","type":"text/html","title":"Configure form"},
        "activities":{"href":"/api/v3/work_packages/34/activities"},
        "availableWatchers":{"href":"/api/v3/work_packages/34/available_watchers"},
        "relations":{"href":"/api/v3/work_packages/34/relations"},
        "revisions":{"href":"/api/v3/work_packages/34/revisions"},
        "watchers":{"href":"/api/v3/work_packages/34/watchers"},
        "addWatcher":{"href":"/api/v3/work_packages/34/watchers","method":"post","payload":{"user":{"href":"/api/v3/users/{user_id}"}},"templated":true},
        "removeWatcher":{"href":"/api/v3/work_packages/34/watchers/{user_id}","method":"delete","templated":true},
        "addRelation":{"href":"/api/v3/work_packages/34/relations","method":"post","title":"Add relation"},
        "changeParent":{"href":"/api/v3/work_packages/34","method":"patch","title":"Change parent of Start of project"},
        "addComment":{"href":"/api/v3/work_packages/34/activities","method":"post","title":"Add comment"},
        "previewMarkup":{"href":"/api/v3/render/markdown?context=/api/v3/work_packages/34","method":"post"},
        "timeEntries":{"href":"/api/v3/time_entries?filters=...","title":"Time entries"},
        "category":{"href":null},
        "type":{"href":"/api/v3/types/9","title":"Milestone"},
        "priority":{"href":"/api/v3/priorities/21","title":"Normal"},
        "project":{"href":"/api/v3/projects/3","title":"Demo project"},
        "status":{"href":"/api/v3/statuses/26","title":"Closed"},
        "author":{"href":"/api/v3/users/1","title":"System"},
        "responsible":{"href":null},
        "assignee":{"href":"/api/v3/users/1","title":"System"},
        "version":{"href":null},
        "budget":{"href":null},
        "logCosts":{"href":"/work_packages/34/cost_entries/new","type":"text/html","title":"Log costs on Start of project"},
        "showCosts":{"href":"/projects/3/cost_reports?...","type":"text/html","title":"Show cost entries"},
        "costsByType":{"href":"/api/v3/work_packages/34/summarized_costs_by_type"},
        "github_pull_requests":{"href":"/api/v3/work_packages/34/github_pull_requests","title":"GitHub pull requests"},
        "watch":{"href":"/api/v3/work_packages/34/watchers","method":"post","payload":{"user":{"href":"/api/v3/users/9"}}},
        "ancestors":[],
        "parent":{"href":null,"title":null},
        "customActions":[]
    }
} */


