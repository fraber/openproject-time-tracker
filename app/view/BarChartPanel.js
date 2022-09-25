/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Panel with a bar chart showing hours per date.
 */
Ext.define('TSTrack.view.BarChartPanel', {
    extend: 'Ext.chart.Chart',
    alias:  'barChart',
    animate: true,
    shadow: true,    
    layout: 'fit',
    header: false,
    title: 'Bar Chart',
    legend: { position: 'right' },
    insetPadding: 20,

    store: null,
    
    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: ['id'],
        title: 'Hours',
        grid: false,
        minimum: 0
    }, {
        type: 'Time',
        position: 'bottom',
        fields: ['spentOn'],
	dateFormat: 'Y-M-d'
    }],

    series: [{
        type: 'line',
        title: 'Hours',
        axis: 'left',
        xField: 'spentOn',
        yField: 'id'
    }]
});
