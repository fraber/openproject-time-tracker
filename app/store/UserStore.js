/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for Users
 */
Ext.define('TSTrack.store.UserStore', {
    storeId: 'UserStore',
    extend: 'TSTrack.store.OpenProjectStore',
    model: 'TSTrack.model.User',
    autoSync: false,

    proxy: {
        type: 'ajax',
	// Use endpoint for users. We have no way yet to only
	// select the users we can impersonate, can we?
        urlPath: '/api/v3/users',
        reader: {type: 'openProjectReader'},
        writer: {type: 'json'}
    },

    userNameFromId: function(userId) {
	var me = this;
	var idx = me.find('id', userId);
	var user = me.getAt(idx);
	if (user) return user.get('name');
	return "undefined";
    }

});

