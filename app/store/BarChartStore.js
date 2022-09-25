/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Calculated store with aggregation from TimeEntries for the BarChart.
 */
Ext.define('TSTrack.store.BarChartStore', {
    storeId: 'barChartStore',
    extend: 'Ext.data.JsonStore',
    debug: 0,
    fields: [], // Filled dynamically
    data: [], // filled dynamically
    
    statics: {
	/**
	 * Aggregates the data of TimeEnties by day and project.
	 * Returns a new store instance with the aggregate.
	 *
	 * This has to be a kind of constructor as a static function,
	 * because we need to use the built-in functionality to convert
	 * a store defined by fields+data into ad-hoc models.
	 */
	createFromTimeEntries: function() {
            var me = this;
            if (me.debug > 0) console.log('BarChartStore.loadFromTimeEntries: Starting');

            var timeEntryStore = Ext.getStore('TimeEntryStore');

            // Get the list of projects actually used in the timeEntryStore
            var projectHash = {}; // Hash from projectId to projectTitle
            var projectHashReverse = {};
            var dateHash = {};
            timeEntryStore.each(function(model) {
		var day = model.get('spentOn').toISOString().substring(0,10);
		projectHash[model.get('projectId')] = model.get('projectTitle');
		projectHashReverse[model.get('projectTitle')] = model.get('projectId');
		dateHash[day] = day;
            });
            var projectTitleList = Object.values(projectHash).sort();

            // Add "day" as the very first field of the projectTitleList,
            // followed by the sorted list of project titles.
            var fieldList = Array.from(projectTitleList);
            fieldList.splice(0, 0, "day");
            
            // Aggregate hours by day and project
            var dataHash = {}; // Hash from date to hash: projectTitle => hours
            timeEntryStore.each(function(model) {
		var day = model.get('spentOn').toISOString().substring(0,10);
		var project = model.get('projectTitle');
		var hours = model.get('hoursNumeric');
		if (!dataHash[day]) dataHash[day] = {};
		var dayHash = dataHash[day];
		if (!dayHash[project]) dayHash[project] = 0.0;
		dayHash[project] = dayHash[project] + hours;
            });

            // Create data array suitable for StackedBarChart
            var data = []; // An array with 
            var dateList = Object.keys(dateHash).sort();
            var firstDate = dateList[0];
            var lastDate = dateList[dateList.length-1];
            for (var d = new Date(firstDate); d < new Date(lastDate); d.setDate(d.getDate()+1)) {
		var day = d.toISOString().substring(0,10);
		if (!dataHash[day]) dataHash[day] = {};
		if (!dateHash[day]) dateHash[day] = day;
            }
            dateList = Object.keys(dateHash).sort(); // Now list with empty entries
            
            dateList.forEach(function(day) {
		var dayHash = dataHash[day]; // Hash: {projectTitle -> hours}
		projectTitleList.forEach(function(p) {
                    if (!dayHash[p]) dayHash[p] = 0.0;
		});
		dayHash['day'] = day; // Add "day" for the data
		data.push(dayHash);
            });

            // Aggregate the elements in timeEntryStore
            var barChartStore = Ext.create('Ext.data.JsonStore', {
		fields: fieldList,
		data: data
            });

	    barChartStore.projectTitleList = projectTitleList;

	    return barChartStore;
	}
    }
});
