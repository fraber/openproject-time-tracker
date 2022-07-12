/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
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
        'name',
        'note'
    ]
});
