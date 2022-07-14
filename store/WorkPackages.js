/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for WorkPackages
 */
Ext.define('TSTrack.store.WorkPackages', {
    storeId: 'WorkPackages',
    extend: 'Ext.data.Store',
    model: 'TSTrack.model.WorkPackage',
    autoLoad: false,
    autoSync: false,

    proxy: {
        type:                   'ajax',
        url:                    'https://community.openproject.org/api/v3/work_packages',
        extraParams:            { filters: '[{"project":{"operator":"=","values":["14"]}}]' },
        headers:                { Authorization: "Basic "+openproject_token },
        api: {
            read:               'https://community.openproject.org/api/v3/work_packages',
            create:             'https://community.openproject.org/api/v3/work_packages',
            update:             'https://community.openproject.org/api/v3/work_packages',
            destroy:            'https://community.openproject.org/api/v3/work_packages',
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

