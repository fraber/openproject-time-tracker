/*
 * Data related to a work package
 *
 */
Ext.define('TSTrack.model.WorkPackage', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        'id',
        'name',
        'parent_id',
        'level'
    ]
});
