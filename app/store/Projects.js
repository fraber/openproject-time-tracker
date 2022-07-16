/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.Projects', {
    storeId: 'Projects',
    extend: 'Ext.data.Store',
    model: 'TSTrack.model.Project',
    autoLoad: false,
    autoSync: false,

    proxy: {
        type:                   'ajax',
        url:                    'https://community.openproject.org/api/v3/projects',
        extraParams:            { pageSize: 1000 },
        headers:                { Authorization: "Basic "+openproject_token },
        api: {
            read:               'https://community.openproject.org/api/v3/projects',
            create:             'https://community.openproject.org/api/v3/projects',
            update:             'https://community.openproject.org/api/v3/projects',
            destroy:            'https://community.openproject.org/api/v3/projects',
        },
        reader: {
            type:               'openProjectReader'
        },
        writer: {
            type:               'json',
            rootProperty:       'data'
        }
    }    
});


/*
    data: [
        {id: 3, parent_id: null, name: 'Demo project'},
        {id: 4, parent_id: null, name: 'Scrum project'},
        {id: 5, parent_id: null, name: 'Dev-empty'},
        {id: 6, parent_id: null, name: 'Dev-large'},
        {id: 7, parent_id: 6,    name: 'Dev-large-child'},
        {id: 8, parent_id: null, name: 'Dev-custom-fields'}
    ]
*/

