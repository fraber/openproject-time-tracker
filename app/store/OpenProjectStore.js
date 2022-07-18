/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Store variant for OpenProject compatibility
 */
Ext.define('TSTrack.store.OpenProjectStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,

    proxy: {
        type: 'ajax',
        reader: { type: 'openProjectReader' },
        writer: { type: 'json' }
    },

    /**
     * Custom OpenProject function adding Basic Auth and filters
     * to the store proxy before loading.
     */
    loadWithAuth: function(configData, filters) {
        var me = this;
        var proxy = me.proxy;
        var urlPath = proxy.urlPath; if (!urlPath) alert('urlPath not set in store: '+me.storeId);
        proxy.url = configData.host + urlPath;
        proxy.extraParams = { pageSize: 1000 };
        if (filters) proxy.extraParams['filter'] = filters;
        proxy.headers = { Authorization: "Basic " + new Buffer.from("apikey"+":" + configData.token).toString('base64') };
        me.load({
            callback: function(r, op, success) {
                if (!success) alert('Store '+me.storeId+' load failed');
            }
        });
    }
});
