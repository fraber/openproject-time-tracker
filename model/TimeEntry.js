/*
 * Data related to a time entry
 *
 */
Ext.define('TSTrack.model.TimeEntry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'project_id',
        'work_package_id',
        'start',
        'end',
        'name',					// 
        'note'
    ]
});
