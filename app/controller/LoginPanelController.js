/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Handle user interactions in the LoginPanel
 * - Set default values
 * - Check if field values are reasonable
 *
 * ToDo: This is just a stub, not finished yet
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
        console.log ('LoginPanelController.init: controller initialization');
        this.control({
            '#loginPanel toolbar > button': { click: this.onButtonClicked },
        });
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        console.log ('LoginPanelController.onLaunch: controller onLaunch');
        this.initConfiguration ();
    },

    /* Initialize the configuration data */
    initConfiguration: function () {
        var me = this;
        var loginPanel = me.getLoginPanel();
        console.log('LoginPanelController.initConfiguration: config('+loginPanel.id+')');

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
        // console.log ('LoginPanelController.onButtonClicked: button clicked button('+button.getText()+') action('+button.action+')');
        switch (button.action) {
        case 'login':
            console.log('LoginPanelController.onButtonClicked: onLogin');
            if (me.formIsValid()) {
                me.login();
            } else {
                alert('Form is not valid');
                console.log('Connection.login: form is not valid - cancelling request');
            }
            break;
        default:
            console.log('LoginPanelController.onButtonClicked: unknown action='+button.action);
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
        console.log('LoginPanelController.login: Starting');

        var configData = me.configData;
        var url = configData.host + '/api/v3/users/me'
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Authorization', "Basic " + new Buffer.from("apikey"+":" + configData.token).toString('base64') );
        xhr.onload = function (event) {
            var response = this;

            if (response.status != 200) {
                console.log('LoginPanelController.login: not successfull');
                Ext.Msg.alert('Login failed', 'Message from server: "'+responseObject.message+'"');
                return;
            }

            var responseJsonString = response.responseText;
            var responseObject = JSON.parse(responseJsonString);
            if (!responseObject) {
                console.log('LoginPanelController.login: error parsing responseText='+responseText);
                // FIXME: Write some message somewhere
                alert('LoginPanelController.login: error parsing responseText='+responseText);
                return;
            }
            var type = responseObject._type;
            var userName = responseObject.name;
            var userId = responseObject.id;
            var userStatus = responseObject.status

            if (userName.toLowerCase() == "anonymous") {
                console.log('LoginPanelController.login: got Anonymous user, which means auth was not successfull');
                Ext.Msg.alert('Login failed', 'The server/token combination is incorrect.');
                return;                    
            }
            if (!type || !userId || !userName || !userStatus) {
                console.log('LoginPanelController.login: no type or id responseText='+responseText);
                alert('LoginPanelController.login: no type or id responseText='+responseText);
                // FIXME: Write some message somewhere
                return;
            }

            // Save configuration information
            configData.id = userId;
            configData.name = userName;
            configData.status = userStatus;
            configData.avatar = responseObject.avatar;
            configData.first_name = responseObject.firstName;
            configData.last_name = responseObject.lastName;
            configData.login = responseObject.login;
            configData.email = responseObject.email;
            configData.language = responseObject.language
            
            console.log(configData);
            me.saveConfigData();
            
            // Activate the TimeEntry panel
            var tabPanel = me.getTabPanel();
            var timeEntryPanel = tabPanel.child('#timeEntryPanel');
            timeEntryPanel.tab.show();
            tabPanel.setActiveTab(timeEntryPanel);

            // Load stores for Projects and TimeEntries
            Ext.getStore('ProjectStore').loadWithAuth(configData);
            var timeEntriesFilters = '[{"user":{"operator":"=","values":["74087"]}}]';
            Ext.getStore('TimeEntryStore').loadWithAuth(configData, timeEntriesFilters);
        }
        xhr.send();
        
        console.log('LoginPanelController.login: Finished');
    }
});
