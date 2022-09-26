/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Data related to a user
 *
 */
Ext.define('TSTrack.model.User', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: '_type', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'login', type: 'string' },
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'admin', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'language', type: 'string' }
    ]
});
