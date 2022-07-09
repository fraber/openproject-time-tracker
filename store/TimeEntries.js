/*
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.TimeEntries', {
    storeId:            'TimeEntries',
    extend:             'Ext.data.Store',
    model:              'TSTrack.model.TimeEntry',

    data: [
        {id: 1, start: new Date('2022-07-09 11:00'), end: new Date('2022-07-09 11:40'), name: 'First entry', note: 'asdf note'},
        {id: 2, start: new Date('2022-07-09 11:41'), end: new Date('2022-07-09 12:12'), name: 'Second entry', note: 'asdf2 note'},
        {id: 3, start: new Date('2022-07-09 14:02'), end: new Date('2022-07-09 15:48'), name: 'Thrird entry', note: 'asdf3 note'},
        {id: 4, start: new Date('2022-07-09 16:23'), end: new Date('2022-07-09 18:46'), name: 'Fourth entry', note: 'asdf4 note'},
    ]
});

/*
    fields: [
        'id',
        'start',
        'end',
        'name',					// 
        'note'
    ]
*/
