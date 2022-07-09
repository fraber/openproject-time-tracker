/*
 * DataStore for WorkPackages
 */
Ext.define('TSTrack.store.WorkPackages', {
    storeId: 'WorkPackages',
    extend: 'Ext.data.Store',
    model: 'TSTrack.model.WorkPackage',

    // Date from Project #3 (Demo Project):
    data: [
        {id: 34, parent_id: null, level: 0,  name: 'Start of project'},
        {id: 35, parent_id: null, level: 0,  name: 'Organize open source conference'},
        {id: 36, parent_id: null, level: 0,  name: 'Set date and location of conference'},
        {id: 37, parent_id: null, level: 0,  name: 'Setup conference website'},
        {id: 38, parent_id: null, level: 0,  name: 'Invite attendees to conference'},
        {id: 39, parent_id: null, level: 0,  name: 'Conference'},
        {id: 40, parent_id: null, level: 0,  name: 'Follow-up tasks'},
        {id: 41, parent_id: null, level: 0,  name: 'Upload presentations to website'},
        {id: 42, parent_id: null, level: 0,  name: 'Party for conference supporters :-)'}
    ]
});
