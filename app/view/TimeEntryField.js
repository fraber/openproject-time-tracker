/*
 * TimeEntryField.js
 *
 * A custom field type to enter an amount of hours.
 * It will format a factional number of hours in some 
 * ISO format like PT5H30 = 5 Hours and 30 minutes
 */

Ext.define('TSTrack.view.TimeEntryField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.timeEntryField',

    debug: 5,

    rawToValue: function(rawValue) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryField: rawToValue('+rawValue+') -> '+rawValue);
        return rawValue;
    },

    valueToRaw: function(value) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryField: valueToRaw('+value+') -> '+value);
        return value;
    },

    /**
     * Returns the current data value of the field. The type of value returned is particular to the type of the
     * particular field (e.g. a Date object for {@link Ext.form.field.Date}), as the result of calling {@link #rawToValue} on
     * the field's {@link #processRawValue processed} String value. To return the raw String value, see {@link #getRawValue}.
     * @return {Object} value The field value
     */
    getValue: function() {
        var me = this;
	if (me.debug > 0) console.log('TimeEntryField: getValue(): raw='+me.getRawValue());

	var val = me.rawToValue(me.processRawValue(me.getRawValue()));
        me.value = val;
        if (me.debug > 0) console.log('TimeEntryField: getValue(): -> '+val);
        return val;
    },

    /**
     * Sets a data value into the field and runs the change detection and validation. To set the value directly
     * without these inspections see {@link #setRawValue}.
     * @param {Object} value The value to set
     * @return {Ext.form.field.Field} this
     */
    setValue: function(value) {
        var me = this;
        if (me.debug > 0) console.log('TimeEntryField: setValue(): '+value);
	var rawValue = me.valueToRaw(value);
        me.setRawValue(rawValue);
        return me.mixins.field.setValue.call(me, value);
    }
});
