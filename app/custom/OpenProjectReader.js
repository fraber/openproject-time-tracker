/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Load data from OpenProject REST format into ExtJS models
 */
Ext.define('TSTrack.custom.OpenProjectReader', {
    extend : 'Ext.data.reader.Json',
    alias: 'reader.openProjectReader',

    /**
     * Parse the response and extract records
     */
    getResponseData : function(response) {
        var me = this;

        try {
            var data = Ext.decode(response.responseText);
        } catch (e) {
            error = new Ext.data.ResultSet({
                total  : 0,
                count  : 0,
                records: [],
                success: false,
                message: e.message
            });
            this.fireEvent('exception', this, response, error);
            Ext.Logger.warn('Unable to parse the JSON returned by the server');
            return error;
        }

        resultSet = me.readRecords(data);
        return resultSet;
    },

     /**
     * Reads a JSON object and returns a ResultSet. Uses the internal getTotal and getSuccess extractors to
     * retrieve meta data from the response, and extractData to turn the JSON data into model instances.
     * @param {Object} data The raw JSON data
     * @return {Ext.data.ResultSet} A ResultSet containing model instances and meta data about the results
     */
    readRecords : function(data) {
        var me = this;
        
        var embedded = data._embedded;
        var elements = embedded.elements;
        var records = me.readModels(elements);

        var resultSet = {
            count: records.length,
            message: "",
            records: records,
            success: true,
            total: records.length,
            totalRecords: records.length
        };
        
        return resultSet;
    },

    readModels: function(elements) {
        var me = this;
        
        var models = [];
        elements.forEach(function(el) {
            var model = me.readModel(me.model, el);
            if (model) models.push(model)
        });

        return models;
    },

    /**
     * Read model based on _links section in options
     */
    readModel: function(model, options) {
        var me = this;

        // Remove structure around comment, which is a special data structure
        if (options.comment) { options["comment"] = options.comment.raw; }
        if (options.description) { options["description"] = options.description.raw; }
        
        // Use ExtJS instantiation for the basic values (id, ...)
        var inst = Ext.create(model, options);
        var data = inst["data"];

        // Check for additional fields in links section and write data
        // directly without set(...) to avoid dirty flag
        var links = options._links;
        Object.keys(links).forEach(function(key) {
            var val = links[key];
            var href = val.href;
            var keyId = key+"Id";
            if (href && data.hasOwnProperty(keyId)) {
                var hrefPieces = href.split("/");
                var lastPiece = hrefPieces[hrefPieces.length-1];
                var lastPieceInt = parseInt(lastPiece);
                data[keyId] = lastPieceInt;
            }
            var title = val.title;
            var keyTitle = key+"Title";
            if (title && data.hasOwnProperty(keyTitle)) {
                data[keyTitle] = title;
            }
        });
        return inst;
    }

});
