/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.Projects', {
    storeId: 'Projects',
    extend: 'TSTrack.store.OpenProjectStore',
    model: 'TSTrack.model.Project',

    autoSync: false,

    proxy: {
        type:                   'ajax',
        urlPath:                '/api/v3/projects',
        
        reader: {
            type:               'openProjectReader'
        },
        writer: {
            type:               'json',
            rootProperty:       'data'
        }
    }
});
