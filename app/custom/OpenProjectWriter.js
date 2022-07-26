/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Load data from OpenProject REST format into ExtJS models
 */
Ext.define('TSTrack.custom.OpenProjectWriter', {
    extend : 'Ext.data.writer.Json',
    alias: 'writer.openProjectWriter',

    getExpandedData: function(data) {
        var me = this,
            dataLength = data.length,
            i = 0,
            item,
            prop,                                 // The property of the model
            modelFields = me.model.getFields(),
            mapping,                              // Where to map the property to REST output
            mappingFn = null,
            nameParts,
            j,
            v,
            tempObj,
            
            toObject = function(name, value) {
                var o = {};
                o[name] = value;
                return o;
            };

        for (; i < dataLength; i++) {
            item = data[i];
            
            for (prop in item) {
                if (item.hasOwnProperty(prop)) {
                    mapping = prop;                    // e.g. my.nested.property: 'foo'
                    mappingFn = null;

                    // Search for the matching field in the model
                    var modelField = null;
                    for (var i = 0; i < modelFields.length; i++) {
                        var field = modelFields[i];
                        if (field.name === prop) {
                            modelField = field;
                            break;
                        }
                    }
                    if (modelField && modelField.jsonMapping) {
                        mapping = modelField.jsonMapping;
                        mappingFn = modelField.toJsonFn
                    }
    
                    nameParts = mapping.split('.');
                    j = nameParts.length - 1;

                    // No hierarchical mapping: just convert
                    if (j == 0 && mappingFn) {
                        // Check for NULL value and skip in that case
                        v = mappingFn.call(item, item[prop]);
                        if (v == null) {
                            delete item[prop];
                            continue;
                        }
                        item[mapping] = v;
                    }

                    // Hierarchical mapping: Convert and write to mapping
                    if (j > 0) {
                        // Initially this will be the value 'foo'.
                        // Equivalent to rec['my.nested.property']
                        tempObj = item[prop];
                        if (modelField.toJsonFn) {
                            tempObj = mappingFn.call(item, tempObj);
                            if (tempObj == null) {
                                delete item[prop];
                                continue
                            }
                        }
                        
                        for (; j > 0; j--) {
                            // Starting with the value above, we loop inside out, assigning the
                            // current object as the value for the parent name. Work all
                            // the way up until only the root name is left to assign.
                            tempObj = toObject(nameParts[j], tempObj);
                        }
                        
                        // At this point we'll have all child properties rolled up into a single
                        // object like `{ nested: { property: 'foo' }}`. Now add the root name
                        // (e.g. 'my') to the record data if needed (do not overwrite existing):
                        item[nameParts[0]] = item[nameParts[0]] || {};
                        // Since there could be duplicate names at any level of the nesting be sure
                        // to merge rather than assign when setting the object as the value:
                        Ext.Object.merge(item[nameParts[0]], tempObj);
                        // Finally delete the original mapped property from the record
                        delete item[prop];
                    }
                }
            }
        }
        return data;
    }

/*
    "_links" : {
        "project" : {
            "href" : "/api/v3/projects/14",
            "title" : "OpenProject"
        },
    }
*/

    
});
