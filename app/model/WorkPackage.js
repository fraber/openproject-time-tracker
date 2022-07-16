/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
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
