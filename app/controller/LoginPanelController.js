/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Handle user interactions in the LoginPanel
 * - Set default values
 * - Check if field values are reasonable
*/
Ext.define('TSTrack.controller.LoginPanelController', {
    extend: 'Ext.app.Controller',
    id: 'loginPanelController',

    refs: [
        { ref: 'mainPanel', selector: '#mainPanel'},
        { ref: 'tabPanel', selector: '#tabPanel'},
        { ref: 'loginPanel', selector: '#loginPanel'},
        { ref: 'timeEntryPanel', selector: '#timeEntryPanel'}
    ],

    debug: 5,
    controllers: {},        // List of controllers, setup during init

    /* Default values for the configuration data */
    loginDefaults: {
        host:        'http://172.16.193.143:4200',
        token:      '9b4c1f6619c4ab3e8ac2c2007b59dc3ec18df9df0b2e2c72e013cdd8ac95201c'
    },

    // Object for clean login information
    configData: {
        changed: false,
        host: null,
        token: null
    },
    
    // This is called before the viewport is created
    init: function() {
        var me = this;
        if (me.debug > 0) console.log ('LoginPanelController.init: controller initialization');
        this.control({
            '#loginPanel toolbar > button': { click: this.onButtonClicked },
        });
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        var me = this;
        if (me.debug > 0) console.log ('LoginPanelController.onLaunch: controller onLaunch');
        this.initConfiguration ();
    },

    /* Initialize the configuration data */
    initConfiguration: function () {
        var me = this;
        var loginPanel = me.getLoginPanel();
        if (me.debug > 0) console.log('LoginPanelController.initConfiguration: config('+loginPanel.id+')');

        const ElectronStore = require ('electron-store');
        const configStore = new ElectronStore ({name: 'config'});

        // Initialize each configuration value to the saved one
        // or to the default value if none is already saved.
        var defaults = me.loginDefaults;
        for (var name in defaults) {
            var defaultValue = defaults[name];
            var value = configStore.get(name, defaultValue);
            var field = loginPanel.down('[name='+name+']');
            field.setValue(value);
            me.configData[name] = value;
        }
    },

    /**
     * Write the configData into Electron-store for persistence
     * for the next session.
     */
    saveConfigData: function () {
        var me = this;

        const ElectronStore = require ('electron-store');
        const configStore = new ElectronStore ({name: 'config'});

        for (var key in me.configData) {
            configStore.set(key, me.configData[key]);
        };
    },

    /**
     * Handle Login button
     */
    onButtonClicked: function (button, event, eOpts) {
        var me = this;
        // if (me.debug > 0) console.log ('LoginPanelController.onButtonClicked: button clicked button('+button.getText()+') action('+button.action+')');
        switch (button.action) {
        case 'login':
            if (me.debug > 0) console.log('LoginPanelController.onButtonClicked: onLogin');
            if (me.formIsValid()) {
                me.login();
            } else {
                alert('Form is not valid');
                if (me.debug > 0) console.log('Connection.login: form is not valid - cancelling request');
            }
            break;
        default:
            if (me.debug > 0) console.log('LoginPanelController.onButtonClicked: unknown action='+button.action);
            break;
        }
    },
    
    /* Check if the data in the form is valid */
    formIsValid: function () {
        var me = this;
        var config = me.getLoginPanel();
        var loginForm = config.down('[name=loginForm]');
        var formIsValid = loginForm.isValid();

        if (formIsValid) {
            me.configData.host = config.down('[name=host]').getValue();
            me.configData.token = config.down('[name=token]').getValue();
        }

        return formIsValid;
    },

    /**
     * Check that the credentials (host + token) are correct and 
     * load stores for Projects and TimeEntries (no WorkPackages yet!)
     */
    login: function() {
        var me = this;
        if (me.debug > 0) console.log('LoginPanelController.login: Starting');

        var configData = me.configData;
        var url = configData.host + '/api/v3/users/me'
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', "Basic " + new Buffer.from("apikey"+":" + configData.token).toString('base64') );
        xhr.onload = function (event) {
            var response = this;
            var responseJsonString = response.responseText;
            var responseObject = JSON.parse(responseJsonString);

            if (response.status != 200) {
                if (me.debug > 0) console.log('LoginPanelController.login: not successfull');
                Ext.Msg.alert('Login failed', 'Message from server:<br><pre>'+responseObject.message+'</pre>');
                return;
            }

            if (!responseObject) {
                if (me.debug > 0) console.log('LoginPanelController.login: error parsing responseText='+responseText);
                // ToDo: Write some message somewhere
                alert('LoginPanelController.login: error parsing responseText='+responseText);
                return;
            }

            me.loginSuccess(responseObject); // Continue successful login process
        }
        xhr.send();
        
        if (me.debug > 0) console.log('LoginPanelController.login: Finished');
    },

    loginSuccess: function(responseObject) {
        var me = this;
        if (me.debug > 0) console.log('LoginPanelController.loginSuccess: Starting');
        
        var type = responseObject._type;
        var userName = responseObject.name;
        var userId = responseObject.id;
        var userStatus = responseObject.status

        if (userName.toLowerCase() == "anonymous") {
            if (me.debug > 0) console.log('LoginPanelController.login: got Anonymous user, which means auth was not successfull');
            Ext.Msg.alert('Login failed', 'The server/token combination is incorrect.');
            return;                    
        }
        if (!type || !userId || !userName || !userStatus) {
            if (me.debug > 0) console.log('LoginPanelController.login: no type or id responseText='+responseText);
            alert('LoginPanelController.login: no type or id responseText='+responseText);
            // FIXME: Write some message somewhere
            return;
        }

        // Save configuration information
        var configData = me.configData;
        configData.id = userId;
        configData.name = userName;
        configData.status = userStatus;
        configData.avatar = responseObject.avatar;
        configData.first_name = responseObject.firstName;
        configData.last_name = responseObject.lastName;
        configData.login = responseObject.login;
        configData.email = responseObject.email;
        configData.language = responseObject.language
        
        if (me.debug > 0) console.log(configData);
        me.saveConfigData();
        
        // Activate the TimeEntry panel
        var tabPanel = me.getTabPanel();
        var timeEntryPanel = tabPanel.child('#timeEntryPanel');
        timeEntryPanel.tab.show();
        tabPanel.setActiveTab(timeEntryPanel);

        // Load stores for Projects
        Ext.getStore('ProjectStore').loadWithAuth(configData);

        // Load TimeEntries store and load the rest of the application
        var timeEntryStore = Ext.getStore('TimeEntryStore');
        var timeEntriesFilters = '[{"user":{"operator":"=","values":["'+userId+'"]}}]';
        timeEntryStore.on('load', function() {
            me.launchRestOfApplication();
        });
        timeEntryStore.loadWithAuth(configData, timeEntriesFilters); // will launch launchRestOfApp()
    },
    
    /**
     * Launch remaining part of the application after the TimeEntries
     * store has been loaded.
     */
    launchRestOfApplication: function() {
        var me = this;
        if (me.debug > 0) console.log('LoginPanelController.launchRestOfApplication: Starting');

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

        var chartPanel = Ext.create('Ext.chart.Chart', {
            animate: true,
            shadow: true,    
            layout: 'fit',
            title: 'Bar Chart',
            legend: {position: 'float', x: 80, y: 30},
            store: barChartStore,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: projectTitleList,
                title: 'Hours',
                minimum: 0
            }, {
                type: 'Time',
                position: 'bottom',
                fields: ['day'],
                dateFormat: 'Y-M-d',
                label: {rotate: {degrees: 315}},
                step: [Ext.Date.DAY, 2]
            }],
            series: [{
                type: 'column',
                axis: 'left',
                xField: 'day',
                yField: projectTitleList,
		stacked: true
            }]
        });

        var tabPanel = me.getTabPanel();
        tabPanel.insert(2, chartPanel); // Insert BarChart after TimeEntry and before About
        tabPanel.setActiveTab(chartPanel);

        if (me.debug > 0) console.log('LoginPanelController.launchRestOfApplication: Finished');              
    }
});
