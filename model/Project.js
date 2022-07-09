/*
 * Data related to a project
 *
 */
Ext.define('TSTrack.model.Project', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'parent_id',
        'name'
    ]
});
