/*
 * TimeEntryField.js
 *
 * A custom field type to enter an amount of hours.
 * It will format a factional number of hours in some 
 * ISO format like PT5H30 = 5 Hours and 30 minutes
 */

Ext.define('TSTrack.view.TimeEntryField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.timeEntryField',

    debug: 0,

    statics: {
	
	/**
	 * Convert a "PT1H30" string (hours + minutes) into a 1.5 number.
	 * Ignores (pass-through of value) of anything other than a "PTxyz" string.
	 */
	durationToHours: function(duration) {
            var me = this;
            if (me.debug > 0) console.log('TimeEntryField: durationToHours("'+duration+'")');

            var result = duration;
            
            if ("string" == typeof duration) {
		var array = duration.match(/PT([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
		if ("object" == typeof array) {
                    if (me.debug > 7) { console.log('TimeEntryField: durationToHours: array='); console.log(array); }
                    var hours = 0; if (array[1]) hours = parseInt(array[1].slice(0, -1));
                    var mins = 0; if (array[2]) mins = parseInt(array[2].slice(0, -1));
                    var secs = 0; if (array[3]) secs = parseInt(array[2].slice(0, -1));
                    if (me.debug > 0) console.log('TimeEntryField: durationToHours: hours='+hours+', mins='+mins+', secs='+secs);
                    result = Math.round(100.0 * (1.0 * hours + mins / 60.0 + secs / (60.0 * 60.0))) / 100.0;
		}
            }
            if (me.debug > 0) console.log('TimeEntryField: durationToHours('+duration+') -> '+result);
            return result;
	},

	/**
	 * Convert a 9.5 number value to PT9H30M ISO 8601 duration string
	 */
	hoursToDuration: function(hours) {
            var me = this;
            if (me.debug > 0) console.log('TimeEntryField: hoursToDuration('+hours+')');
            var result = hours;

            if (typeof hours == 'number') {
		var h = Math.trunc(hours);
		var m = Math.round(100.0 * (hours - h) * 60.0) / 100.0;
		result = "PT"+h+"H"+m+"M";
            }

            if (me.debug > 0) console.log('TimeEntryField: hoursToDuration('+hours+') -> '+result);
            return result;
	}
	
    },
    
    /**
     * Convert a 9.5 number value to PT9H30M ISO 8601 duration string
     */
    rawToValue: function(rawValue) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryField: rawToValue("'+rawValue+'")');

        var result = rawValue;

        if (typeof rawValue == 'number' && rawValue != NaN) {
            result = me.self.hoursToDuration(rawValue);
        }

        if (typeof rawValue == 'string' && rawValue.length > 0 && NaN !== parseFloat(rawValue)) {
            result = me.self.hoursToDuration(parseFloat(rawValue));
        }

	if (me.debug > 0) console.log('TimeEntryField: rawToValue('+rawValue+') -> '+result);
        return result;
    },

    /**
     * Convert a "PT1H30" string (hours + minutes) into a 1.5 number.
     */
    valueToRaw: function(value) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryField: valueToRaw('+value+')');

        var result = value;

        if (typeof value == 'string') {
            result = me.self.durationToHours(value);
        }
        
        if (me.debug > 0) console.log('TimeEntryField: valueToRaw('+value+') -> '+result);
        return result;
    }
});
