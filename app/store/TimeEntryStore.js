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
    autoSync:           false, // Let TimeEntryController handle save() manually
    sorters: [
        {property: 'spentOn', direction: 'DESC'},
        {property: 'start', direction: 'DESC'}
    ],
    proxy: {                   // The proxy interfaces with the OpenProject API
        type: 'ajax',
        urlPath: '/api/v3/time_entries',  // Default URL that works for read and create.

        // Update entries individually, OpenProject only supports updates one by one.
        batchActions: false,
        
        api: {
            // read: works with urlPath above
            // create: works with urlPath above
            update: '/api/v3/time_entries/',
            destroy: '/api/v3/time_entries/'
        },

        // Use customized ways to send/parse the communication with OpenProject API
        reader: { type: 'openProjectReader' },
        writer: { type: 'openProjectWriter', expandData: true },

        // Use custom configuration (PATCH) for operations
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PATCH',
            destroy: 'DELETE'
        },

        /**
         * This code overwrites Ext.data.proxy.Server.getUrl(...).
         * The normal getUrl() assumes static URLs for GET.
         * However, the OpenProject API requires adding the object Id
         * at the end of the URL for update and destroy operations.
         *
         * Normally, this code should be part of the OpenProjectReader,
         * but it's part of the proxy unfortunately...
         *
         * This is what this code adds...
         *
         * Original comment:
         * Get the url for the request taking into account the order of priority,
         * - The request
         * - The api
         * - The url
         * @private
         * @param {Ext.data.Request} request The request
         * @return {String} The url
         */
        getUrl: function(request) {
            if (request.url)
                return request.url;

            if (this.api[request.action]) {
                var url = this.host + this.api[request.action];
                if (['update', 'destroy'].includes(request.action)) {
                    var timeEntryId = request.records[0].get('id');
                    url = url + timeEntryId; // add the Id to the end of the URL
                }
                return url;
            }
            
            if (this.url)
                return this.url; // read operation
        },

        /**
         * Customize the way the Ext.data.proxy.Server (proxy...)
         * extracts an error message after a failed transaction.
         * OpenProject returns message in field "message".
         *
         * Original comment from ExtJS:
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
