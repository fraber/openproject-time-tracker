/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * StoreLoadCoordinator.js
 *
 * This coodinator is initiated with:
 * stores: A list of stores that need to be loaded and
 * listeners: {
 *           load: function() {}
 * }
 * It calls the listener function once all stores
 * have been sussessfully loaded.
 *
 * The StoreLoadCoordinator plays it's role after
 * Ext.Loader has finished loading classes and before
 * the start of the actual application.
*/
Ext.define('TSTrack.controller.StoreLoadCoordinator', {
    mixins: { observable: 'Ext.util.Observable' },

    debug: 0,
    controllers: {},
    
    resetStoreLoadStates: function() {
        var me = this;
        this.storeLoadStates = {};  
        Ext.each(this.stores, function(storeId) {
            this.storeLoadStates[storeId] = false;
        }, this);   
    },

    isLoadingComplete: function() {
        var me = this;
        for (var i=0; i<this.stores.length; i++) {
            var key = this.stores[i];
            if (this.storeLoadStates[key] == false) {
                if (this.debug > 0) { console.log('PO.controller.StoreLoadCoordinator.isLoadingComplete: store='+key+' not loaded yet.'); }
                return false;
            }
        }
        return true;
    },

    onStoreLoad: function(store, records, successful, eOpts, storeName) {
        var me = this;
        if (this.debug > 0) { console.log('PO.controller.StoreLoadCoordinator.onStoreLoad: store='+store.storeId); }
        this.storeLoadStates[store.storeId] = true;
        if (this.isLoadingComplete() == true) {
            if (this.debug > 0) { console.log('PO.controller.StoreLoadCoordinator.onStoreLoad: all stores loaded - starting application'); }
            this.fireEvent('load');
        }
    },

    constructor: function (config) {
        var me = this;
        this.mixins.observable.constructor.call(this, config);
        this.resetStoreLoadStates();
        Ext.each(this.stores, function(storeId) {
            var store = Ext.StoreManager.lookup(storeId);
            store.on('load', Ext.bind(this.onStoreLoad, this, [storeId], true));
        }, this);
        this.addEvents('load');
    }
});


