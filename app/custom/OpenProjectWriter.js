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

    // writeRecords: function(request, data) { return this.super(request, data);  },

    /**
     * Write a single value into data
     */
    writeValue: function(data, field, record){
        var name = field[this.nameProperty],
            dateFormat = this.dateFormat || field.dateWriteFormat || field.dateFormat,
            value = record.get(field.name);

        // Allow the nameProperty to yield a numeric value which may be zero.
        // For example, using a field's numeric mapping to write an array for output.
        if (name == null) {
            name = field.name;
        }

        if (field.serialize) {
            alert('serialize');
            data[name] = field.serialize(value, record);
        } else if (field.type === Ext.data.Types.DATE && dateFormat && Ext.isDate(value)) {
            alert('dateformat');
            data[name] = Ext.Date.format(value, dateFormat);
        } else {

            switch(name) {
            case 'comment':
                break;
            default:
                
            }

            // ToDo: Transform baseName to /api/v3/xyz/...
            
            // Check for *Id + *Title combination and write to links
            var len = name.length;
            var nameBase = name.substring(0, len-2);
            var namePostfix = name.substring(len-2);
            var nameTitle = nameBase+'Title';
            var modelHasField = record.data.hasOwnProperty(nameTitle);
            var nameUrlPath = "/api/v3/"+baseName+"/";
            
            if (namePostfix = 'Id' && modelHasField) {
                // write out _link with property
                var titleValue = record.get(nameTitle);
                var link = { href: nameUrlPath+value, title: titleValue }
                var links = data["_links"];
                links["project"] = link
            } else {
                // Just write out normally.
                data[name] = value;
            }
            
        }
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
