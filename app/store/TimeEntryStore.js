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
    autoSync:           false, // handled by TimeEntryController
    sorters: [
        {property: 'spentOn', direction: 'DESC'},
        {property: 'start', direction: 'DESC'}
    ],
    proxy: {
        type: 'ajax',
        urlPath: '/api/v3/time_entries',
	batchActions: false,   // Don't put multiple updates into one operations, OpenProject doesn't support this.
	
        api: {
            // read: works with urlPath above
            // create: works with urlPath above
            update: '/api/v3/time_entries/',
            destroy: '/api/v3/time_entries/'
        },
        
        reader: { type: 'openProjectReader' },
        writer: { type: 'openProjectWriter', expandData: true },

        success: function(a) { alert('proxy success'); },
        failure: function(a) { alert('proxy failure'); },

        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PATCH',
            destroy: 'DELETE'
        },

        /**
         * ToDo: Not sure why we're overwriting this method...
         * ... and what's the difference.
         */
        getUrl: function(request) {
            if (request.url)
                return request.url;

            if (this.api[request.action]) {
                var url = this.host + this.api[request.action];
                if (['update', 'destroy'].includes(request.action)) {
                    var timeEntryId = request.records[0].get('id');
                    url = url + timeEntryId;
                }
                return url;
            }
            
            if (this.url)
                return this.url; // read operation
        },

        /**
         * Extract an exception object from an error reponse.
         * Takes the message property of the
         * response (if possible), rather than statusText.
         *
         * @param {Ext.data.Operation} operation The operation
         * @param {Object} response The response
         */
        setException: function(operation, response) {

            var statusText = response.statusText; // default original
            
            try {
                var data = Ext.decode(response.responseText); // try OpenProject reply
                statusText = data.message;
            } catch (e) {
                // Nothing, ignore...
            }
            
            operation.setException({
                status: response.status,
                statusText: statusText
            });
        }

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
