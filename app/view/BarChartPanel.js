/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 */

/**
 * This is just an empty panel to show the BarChart.
 * The chart has to be calculated dynamically with an aggregate
 * of hours from the TimeEntries store. This includes the
 * possibility of new projects add etc., so we have to renew
 * the entire chart.
 * The easiest option is to maintain this empty container and
 * to add to calculate the store+chart whenever the user switches
 * to the BarChart tab.
 */
Ext.define('TSTrack.view.BarChartPanel', {
    extend: 'Ext.panel.Panel',
    id: 'barChartPanel',
    layout: 'fit',
    header: false,
    title: 'Bar Chart',
    items: [] // filled dynamically with BarChart
});

/**
 * Bar chart showing hours per date.
 * This chart is created by MainPanelContoller when the
 * user clicks on Bar Chart.
 */
Ext.define('TSTrack.view.BarChart', {
    extend: 'Ext.chart.Chart',
    id: 'barChart',
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
        label: {rotate: {degrees: 270}}
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

