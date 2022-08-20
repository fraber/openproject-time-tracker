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
     * Reads a JSON object and returns a ResultSet. 
     * Implements custom getTotal and getSuccess extractors.
     * @param {Object} data The raw JSON data
     * @return {Ext.data.ResultSet} A ResultSet containing model instances and meta data about the results
     */
    readRecords : function(data) {
        var me = this,
            type = data._type;

        switch (type) {
        case null:           // This should not happen, really
            console.log('OpenProjectReader.readRecords: Found invalid null argument');
            return null;
        case 'Collection':   // Read a collection of objects
            return me.readRecordsCollection(data);
        default:             // Read a single object
            return me.readRecordsObject(data);
        }
    },

    /**
     * OpenProject has indicated that the _type of data is not "Collection",
     * so it should be a single object.
     */
    readRecordsObject: function(data) {
        var me = this,
            inst,
            records = [];
        
        inst = me.readModel(me.model, data);
        if (inst) records.push(inst);

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

    /**
     * OpenProject has indicated that the _type of data is "Collection".
     */
    readRecordsCollection: function(data) {
        var me = this,
            embedded,
            elements = null,
            records = [];

        embedded = data._embedded;
        if (embedded) {  // OpenProject normally returns elements, except for DELETE
            elements = embedded.elements;
            records = me.readModels(elements);
        }

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

    /**
     * Convert an array of JSON objects into an array of Models
     */
    readModels: function(objs) {
        var me = this,
            inst,
            modelInstances = [];
        
        objs.forEach(function(obj) {
            inst = me.readModel(me.model, obj);
            if (inst) modelInstances.push(inst)
        });

        return modelInstances;
    },

    /**
     * Parse a single JSON object to create a Model.
     * Deals with mappings in the Model to extract the values
     * from the right attributes on the JSON object.
     */
    readModel: function(model, json) {
        var me = this,
            modelFields = me.model.getFields(),
            inst,
            field,
            mapping,
            mappingFn;

        // Check for model fields with mappings.
        // Mapped values will overwrite "flat" values.
        for (var i = 0; i < modelFields.length; i++) {
            field = modelFields[i];
            mapping = field.jsonMapping;
            mappingFn = field.fromJsonFn;
            if (mapping) {
                var val = me.readModelAttribute(json, mapping);
                if (val) {
                    if (mappingFn) {
                        val = mappingFn.call(model, val);
                    }
                    json[field.name] = val;
                }
            }
        }

        // Create a base model from mapped values
        inst = Ext.create(model, json);

        return inst;
    },

    /**
     * Extract a specific value from an object using a path
     * (= array of attributes)
     */
    readModelAttribute(object, pathString) {
        var obj = object,
            pathArray = pathString.split('.'),
            prop;

        for (var i = 0; i < pathArray.length; i++) {
            prop = pathArray[i];
            if (!obj.hasOwnProperty(prop)) {
                return null;
            }

            obj = obj[prop];
        }
        return obj;
    }
    
});
