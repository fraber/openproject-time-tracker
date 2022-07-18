/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.TimeEntryStore', {
    extend:             'TSTrack.store.OpenProjectStore',
    storeId:            'TimeEntryStore',
    model:              'TSTrack.model.TimeEntry',
    autoSync: true,
    sorters: [
        {property: 'spentOn', direction: 'DESC'},
        {property: 'start', direction: 'DESC'}
    ],
    proxy: {
        type: 'ajax',
        urlPath: '/api/v3/time_entries',
        reader: { type: 'openProjectReader' },
//        writer: { type: 'openProjectWriter' }
    }    
});


/*
https://community.openproject.org/api/v3/time_entries
filters=[{"work_package":{"operator": "=", "values": ["1", "2"]}}, {"project":{"operator":"=","values":["1"]}}]
filters=[{"project":{"operator":"=","values":["14"]}}]
filters=[{"user":{"operator":"=","values":["74087"]}}]

{
   "_links" : {
      "nextByOffset" : {
         "href" : "/api/v3/time_entries?filters=%5B%5D&offset=2&pageSize=50"
      },
      "createTimeEntryImmediately" : {
         "method" : "post",
         "href" : "/api/v3/time_entries"
      },
      "self" : {
         "href" : "/api/v3/time_entries?filters=%5B%5D&offset=1&pageSize=50"
      },
      "changeSize" : {
         "href" : "/api/v3/time_entries?filters=%5B%5D&offset=1&pageSize=%7Bsize%7D",
         "templated" : true
      },
      "jumpTo" : {
         "templated" : true,
         "href" : "/api/v3/time_entries?filters=%5B%5D&offset=%7Boffset%7D&pageSize=50"
      },
      "createTimeEntry" : {
         "method" : "post",
         "href" : "/api/v3/time_entries/form"
      }
   },
   "_type" : "Collection",
   "offset" : 1,
   "_embedded" : {
      "elements" : [
         {
            "id" : 27157,
            "updatedAt" : "2022-07-13T09:03:28Z",
            "spentOn" : "2022-07-12",
            "createdAt" : "2022-07-13T09:03:28Z",
            "comment" : {
               "format" : "plain",
               "raw" : "Checked other migrations, developed, investigated testing options",
               "html" : "<p>Checked other migrations, developed, investigated testing options</p>"
            },
            "_type" : "TimeEntry",
            "_links" : {
               "delete" : {
                  "href" : "/api/v3/time_entries/27157",
                  "method" : "delete"
               },
               "updateImmediately" : {
                  "href" : "/api/v3/time_entries/27157",
                  "method" : "patch"
               },
               "user" : {
                  "href" : "/api/v3/users/74087",
                  "title" : "Frank Bergmann"
               },
               "project" : {
                  "href" : "/api/v3/projects/14",
                  "title" : "OpenProject"
               },
               "schema" : {
                  "href" : "/api/v3/time_entries/schema"
               },
               "update" : {
                  "href" : "/api/v3/time_entries/27157/form",
                  "method" : "post"
               },
               "workPackage" : {
                  "title" : "Copying a project shall also copy file links attached to all work packages",
                  "href" : "/api/v3/work_packages/41530"
               },
               "self" : {
                  "href" : "/api/v3/time_entries/27157"
               },
               "activity" : {
                  "href" : "/api/v3/time_entries/activities/9",
                  "title" : "Development"
               }
            },
            "hours" : "PT5H"
         }         
      ]
   },
   "total" : 10277,
   "pageSize" : 50,
   "count" : 50
}


*/
