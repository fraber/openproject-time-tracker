/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * DataStore for WorkPackages
 */
Ext.define('TSTrack.store.WorkPackageStore', {
    storeId: 'WorkPackageStore',
    extend: 'TSTrack.store.OpenProjectStore',
    model: 'TSTrack.model.WorkPackage',

    autoSync: false, // handle loads programatically (onCellChange and beforeEdit)
    projectId: null, // store the project to which the WorkPackages belong

    proxy: {
        type:                   'ajax',
        urlPath:                '/api/v3/work_packages',
        reader: {
            type:               'openProjectReader'
        },
        writer: {
            type:               'json',
            rootProperty:       'data'
        }
    },

    workPackageNameFromId: function(id) {
	var me = this;
	var idx = me.find('id', id);
	var model = me.getAt(idx);
	if (model) return model.get('subject');
	return "undefined";
    }
});
