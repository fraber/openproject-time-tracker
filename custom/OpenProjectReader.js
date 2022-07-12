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
            var model = Ext.create(me.model, el);
            if (model) models.push(model)
        });

        return models;
    }
    
});
