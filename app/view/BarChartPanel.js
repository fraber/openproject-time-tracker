/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Panel with a bar chart showing hours per date.
 * This chart is created by LoginContoller after the 
 * TimeEntries store has been loaded. It then creates a
 * new store with the aggregated data from TimeEntries.
 */
Ext.define('TSTrack.view.BarChartPanel', {
    extend: 'Ext.chart.Chart',
    alias:  'barChart',
    animate: true,
    shadow: true,    
    layout: 'fit',
    header: false,
    title: 'Bar Chart',
    legend: {position: 'float', x: 80, y: 30},
    store: null, // To be set by calling function
    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: [], // To be set by calling function
        title: 'Hours',
        minimum: 0
    }, {
        type: 'category',
        position: 'bottom',
        fields: ['day'],
        // dateFormat: 'Y-M-d',
        label: {rotate: {degrees: 270}},
        step: [Ext.Date.DAY, 1]
    }],
    series: [{
        type: 'column',
        axis: 'left',
        stacked: true,
        xField: 'day',
        yField: [], // To be set by calling function,
        tips: {
            trackMouse: true,
            width: 120,
            height: 40,
            renderer: function(storeItem, item) {
                var day = storeItem.get('day');
                var projectTitle = item.yField;
                var hours = storeItem.get(projectTitle);
                this.setTitle("Project: "+projectTitle+"<br>Date: "+day+"<br>Hours: "+hours+"h");
            }
        }
    }]
});

