/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
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
