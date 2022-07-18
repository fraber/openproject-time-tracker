/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for WorkPackages
 */
Ext.define('TSTrack.store.WorkPackages', {
    storeId: 'WorkPackages',
    extend: 'TSTrack.store.OpenProjectStore',
    model: 'TSTrack.model.WorkPackage',

    autoSync: false,

    proxy: {
        type:                   'ajax',
        urlPath:                '/api/v3/work_packages',
/*
        url:                    'http://localhost/api/v3/work_packages', // to be replaced:
        extraParams:            { pageSize: 1000, filters: '[{"project":{"operator":"=","values":["14"]}}]' },
        headers:                { Authorization: "Basic "+openproject_token },
*/
        reader: {
            type:               'openProjectReader'
        },
        writer: {
            type:               'json',
            rootProperty:       'data'
        }
    }    
});
