/*
 * DataStore for TimeEntries
 */
Ext.define('TSTrack.store.Projects', {
    storeId: 'Projects',
    extend: 'Ext.data.Store',
    model: 'TSTrack.model.Project',

    data: [
        {id: 3, parent_id: null, name: 'Demo project'},
        {id: 4, parent_id: null, name: 'Scrum project'},
        {id: 5, parent_id: null, name: 'Dev-empty'},
        {id: 6, parent_id: null, name: 'Dev-large'},
        {id: 7, parent_id: 6,    name: 'Dev-large-child'},
        {id: 8, parent_id: null, name: 'Dev-custom-fields'}
    ]
});

