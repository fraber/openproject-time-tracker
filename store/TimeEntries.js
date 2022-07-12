/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.TimeEntries', {
    extend:             'Ext.data.Store',
    storeId:            'TimeEntries',
    model:              'TSTrack.model.TimeEntry',
    // fields: ['id', 'start', 'end', 'name', 'note']
    proxy: {
        type: 'localstorage',
        id: 'TimeEntries'
    }
});


/*
    data: [
{id: 1, project_id: 3, work_package_id: 39, start: new Date('2022-07-09 11:00'), end: new Date('2022-07-09 11:40'), name: 'First entry', note: 'asdf'},
{id: 2, project_id: 3, work_package_id: 39, start: new Date('2022-07-09 11:41'), end: new Date('2022-07-09 12:12'), name: 'Second entry', note: 'asdf2'},
{id: 3, project_id: 3, work_package_id: 39, start: new Date('2022-07-09 14:02'), end: new Date('2022-07-09 15:48'), name: 'Thrird entry', note: 'asdf3'},
{id: 4, project_id: 3, work_package_id: 39, start: new Date('2022-07-09 16:23'), end: new Date('2022-07-09 18:46'), name: 'Fourth entry', note: 'asdf4'},
    ]
*/
