/*
 * Data related to a time entry
 *
 */
Ext.define('TSTrack.model.TimeEntry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'start',
        'end',
        'name',					// 
        'note'
    ]
});
