/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Handle user interactions in the MainPanel
*/
Ext.define('TSTrack.controller.MainPanelController', {
    extend: 'Ext.app.Controller',
    id: 'mainPanelController',

    refs: [
        { ref: 'mainPanel', selector: '#mainPanel'},
        { ref: 'tabPanel', selector: '#tabPanel'},
        { ref: 'loginPanel', selector: '#loginPanel'},
        { ref: 'barChartPanel', selector: '#barChartPanel'},
        { ref: 'timeEntryPanel', selector: '#timeEntryPanel'}
    ],

    debug: 0,

    // This is called before the viewport is created
    init: function() {
        var me = this;
        if (me.debug > 0) console.log ('MainPanelController.init: controller initialization');
        this.control({
            '#tabPanel': { tabchange: this.onTabChange },
        });
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        var me = this;
        if (me.debug > 0) console.log ('MainPanelController.onLaunch: controller onLaunch');
        this.initConfiguration ();
    },

    /* Initialize the configuration data */
    initConfiguration: function () {
        var me = this;
        if (me.debug > 0) console.log('MainPanelController.initConfiguration: Starting');
    },

    /**
     * Handle tab changes
     */
    onTabChange: function (tabPanel, newTab, oldTab, eOpts) {
        var me = this;
        if (me.debug > 0) console.log ('MainPanelController.onTabChange: newTab='+newTab.id);
        switch (newTab.id) {
        case 'timeEntryPanel':
            if (me.debug > 0) console.log('MainPanelController.onTabChange: timeEntryPanel');
            break;
        case 'barChartPanel':
            // Re-calculate the aggregation and launch the chart
	    me.onBarChartPanelTabChange();
            break;
        default:
            console.error('MainPanelController.onTabChange: unknown option: '+newTab.id);
            break;
        }
    },

    /**
     * Recalculate the BarPanel and it's aggregation store.
     */
    onBarChartPanelTabChange: function() {
        var me = this;
        if (me.debug > 0) console.log('MainPanelController.onBarChartPanelTabChange: Starting');

        var barChartPanel = me.getBarChartPanel();
	var barChartStore = TSTrack.store.BarChartStore.createFromTimeEntries(); // Aggregate hours
	var chart = Ext.create('TSTrack.view.BarChart', { store: barChartStore });

        var yAxis = chart.axes.get('left');
        var series = chart.series.getAt(0);
        yAxis.fields = barChartStore.projectTitleList;
        series.yField = barChartStore.projectTitleList;

	// add the new chart to the container panel
	barChartPanel.add(chart);
	
        if (me.debug > 0) console.log('MainPanelController.onBarChartPanelTabChange: Finished');              
    }
    
});
