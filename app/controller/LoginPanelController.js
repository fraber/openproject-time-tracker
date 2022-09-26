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
        { ref: 'buttonLogin', selector: '#buttonLogin'},
        { ref: 'impersonateFieldSet', selector: '#impersonateFieldSet'},
        { ref: 'impersonateUser', selector: '#impersonateUser'},
        { ref: 'timeEntryPanel', selector: '#timeEntryPanel'}
    ],

    debug: 5,
    controllers: {},        // List of controllers, setup during init

    /* Default values for the configuration data */
    loginDefaults: {
        host:        'http://172.16.193.143:4200',
        token:       '9b4c1f6619c4ab3e8ac2c2007b59dc3ec18df9df0b2e2c72e013cdd8ac95201c',
        startPeriod: new Date("2000-01-01"),
        endPeriod:   new Date("2099-12-31"),
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
            // Replace trailing "/" characters from host
            var host = config.down('[name=host]').getValue();
            host = host.replace(/\/+$/, "");
            
            me.configData.host = host;
            me.configData.token = config.down('[name=token]').getValue();

            var startDate = config.down('[name=startPeriod]').getValue();
            startDate.setHours(startDate.getHours()+12); // Work around Browser bug
            me.configData.startPeriod = startDate.toISOString().substring(0,10);

            var endDate = config.down('[name=endPeriod]').getValue();
            endDate.setHours(endDate.getHours()+12);
            me.configData.endPeriod = endDate.toISOString().substring(0,10);

            // var user = config.down('[name=impersonateUser]').getValue();
            var userCombo = me.getImpersonateUser();
	    var user = userCombo.getValue();
	    me.configData.impersonateUser = user;
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

            if (!responseObject) {
                console.error('LoginPanelController.login failed: Error parsing response');
                Ext.Msg.alert('Login failed', 'Error parsing response.');
                return;
            }

            if (response.status != 200) {
                console.error('LoginPanelController.login failed with status: '+ response.status);
                Ext.Msg.alert('Login failed', 'Message from server:<br><pre>'+responseObject.message+'</pre>');
                return;
            }

            // Check for successful /api/v3/users/me and save values
            var success = me.saveLoginData(responseObject);
            if (success) {
                // Hide Login and show all other tabs
                me.activateTabs();

                // Load stores for projects, time entries etc.
                me.loadStores();
            }

        }
        xhr.send();
        
        if (me.debug > 0) console.log('LoginPanelController.login: Finished');
    },

    /**
     * Check and save falues returned by /api/v3/users/me.
     * Returns true if successful, false if bad login.
     */
    saveLoginData: function(responseObject) {
        var me = this;
        if (me.debug > 0) console.log('LoginPanelController.saveLoginData: Starting');
        
        var type = responseObject._type;
        var userName = responseObject.name;
        var userId = responseObject.id;
        var userStatus = responseObject.status

        if (userName.toLowerCase() == "anonymous") {
            console.log('LoginPanelController.login: got Anonymous user, which means auth was not successfull');
            Ext.Msg.alert('Login failed', 'The server/token combination is incorrect.');
            return false;
        }
        if (!type || !userId || !userName || !userStatus) {
            console.log('LoginPanelController.login: no type or user id in responseText='+responseText);
            Ext.Msg.alert('Login failed', 'Response did not contain type of user ID:<br><pre>'+responseText+'</pre>');
            return false;
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
        me.saveConfigData();

        return true;
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
     * After successful login load the various stores.
     */
    loadStores: function(configData) {
        var me = this;
        var configData = me.configData;
        var userId = configData.id;
        var startISO = configData.startPeriod;
        var endISO = configData.endPeriod;

	var impersonateUserId = configData.impersonateUser;
	if (!!impersonateUserId) {
	    userId = impersonateUserId;    // Load data for this user
	}

	
        // Load base stores, don't wait for success
        Ext.getStore('ProjectStore').loadWithAuth(configData);
        Ext.getStore('UserStore').loadWithAuth(configData);

        // Load TimeEntries store and launch the rest of the application
        var timeEntryStore = Ext.getStore('TimeEntryStore');
        var timeEntriesUserFilters = '{"user":{"operator":"=","values":["'+userId+'"]}}';
        var timeEntriesIntervalFilters = '{"spent_on":{"operator":"<>d","values":["'+startISO+'","'+endISO+'"]}}';	
        var timeEntriesFilters = '['+timeEntriesUserFilters+','+timeEntriesIntervalFilters+']';
        timeEntryStore.on('load', function() { me.afterTimeEntryStoreLoaded(); });
        timeEntryStore.loadWithAuth(configData, timeEntriesFilters);
    },
    
    /**
     * Setup tabs for operation
     */
    activateTabs: function() {
        var me = this;

        // Hide the Login part of the panel
        var loginPanel = me.getLoginPanel();
        var loginFieldSet = loginPanel.down('[name='+loginFieldSet+']');
        loginFieldSet.hide();

	var impersonateFieldSet = me.getImpersonateFieldSet();
	impersonateFieldSet.show();
	
        // Activate all tabs in the TabPanel
        var tabPanel = me.getTabPanel();
        tabPanel.items.each(function(item) {
            item.tab.show();
        });
        
        // Rename the login panel to config panel, including the button
        loginPanel.tab.setText('Config');
        var loginButton = me.getButtonLogin();
        loginButton.setText('Apply');
        
        // Activate the TimeEntry Panel
        var timeEntryPanel = tabPanel.child('#timeEntryPanel');
        tabPanel.setActiveTab(timeEntryPanel);
    },
    
    
    /**
     * Not used anymore.
     * We used to launch the remaining application after 
     * the TimeEntries store has been loaded.
     */
    afterTimeEntryStoreLoaded: function() {
        var me = this;
        if (me.debug > 0) console.log('LoginPanelController.afterTimeEntryStoreLoaded: Starting');

        if (me.debug > 0) console.log('LoginPanelController.afterTimeEntryStoreLoaded: Finished');              
    }
});
