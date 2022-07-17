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
        url:        'http://172.16.193.143:4200',
        token:      '0b4c1f6619c4ab3e8ac2c2007b59dc3ec18df9df0b2e2c72e013cdd8ac95201c'
    },

    // Object for clean login information
    configData: {
        changed: false,
        url: null,
        token: null
    },
    
    // This is called before the viewport is created
    init: function() {
        console.log ('LoginPanelController.init: controller initialization');
        this.control({
            '#loginPanel field': { change: this.onFieldChanged },
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

    /************************************************************
     * Configuration data changes
     ************************************************************/

    onFieldChanged: function (field, newValue, oldValue, eOpts) {
        var me = this;
        var name = field.name;
        console.log('LoginPanelController.onFieldChanged: field('+name+') changed from oldValue('+oldValue+') to newValue('+newValue+') eOpts('+eOpts+')');

        const ElectronStore = require ('electron-store');
        const configStore = new ElectronStore ({name: 'config'});

        if (name in me.loginDefaults && me.configData[name] != newValue) {
            console.log ('LoginPanelController.onFieldChanged: field('+name+') changed from('+me.configData[name]+') to('+newValue+')');
            me.configData[name] = newValue;
            me.configData.changed = true;
            configStore.set(name, newValue);
        }
    },

    /************************************************************
     * Button actions
     ************************************************************/

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
        case 'projects':
            console.log('LoginPanelController.onButtonClicked: projects clicked');
            me.connectionController.loadProjects();
            break;
        case 'sync':
            console.log('LoginPanelController.onButtonClicked: sync clicked');
            //me.connectionController.syncExecOperations();
            me.connectionController.syncAll();
            break;
        case 'commit':
            console.log('LoginPanelController.onButtonClicked: commit clicked');
            me.connectionController.syncExecOperationsNonEasy();
            break;
        }
    },

    /**
     * Check that the credentials (URL + token) are correct
     */
    login: function() {
        var me = this;
        console.log('LoginPanelController.login: Starting');

        var configData = me.configData;
        var url = configData.url + '/api/v3/users/me'
        // var url = configData.url + '/api/v3/work_packages'
        console.log ('LoginPanelController.login: url('+configData.url+') token('+configData.token+')');
        Ext.Ajax.request({
            defaultHeaders: { Authorization: "Basic " + configData.token },
            url: url,
            callback: function (options, success, response) {
                var responseJsonString = response.responseText;
                var responseObject = JSON.parse(responseJsonString);

                if (!success) {
                    console.log('LoginPanelController.login: not successfull');
                    Ext.Msg.alert('Login failed', 'Message from server: "'+responseObject.message+'"');
                    return;
                }

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
                    Ext.Msg.alert('Login failed', 'The server/token combination is incorrect.<br>Please request a new token.');
                    return;                    
                }
                if (!type || !userId || !userName || !userStatus) {
                    console.log('LoginPanelController.login: no type or id responseText='+responseText);
                    alert('LoginPanelController.login: no type or id responseText='+responseText);
                    // FIXME: Write some message somewhere
                    return;
                }

                // Save configuration information
                configData.userId = userId;
                configData.userName = userName;
                configData.userStatus = userStatus;

                // Activate the TimeEntry panel
                var tabPanel = me.getTabPanel();
                var timeEntryPanel = tabPanel.child('#timeEntryPanel');
                timeEntryPanel.tab.show();
                tabPanel.setActiveTab(timeEntryPanel);

                // Load stores
                var timeEntriesStore = Ext.getStore('TimeEntries');
                var proxy = timeEntriesStore.getProxy();
                proxy.url = configData.url+"/api/v3/time_entries";
                proxy.extraParams = {
                    pageSize: 1000,
                    // filters: '[{"user":{"operator":"=","values":["'+configData.userId+'"]}}]'
                };
                proxy.headers = { Authorization: "Basic " + configData.token };
                timeEntriesStore.load({
                    callback: function(r, op, success) {
                        if (!success) alert('Store: TimeEntries load failed');
                    }
                });
            }
        });

        console.log('LoginPanelController.login: Finished');
    },
    
    /* Check if the form data is valid */
    formIsValid: function () {
        var me = this;
        var config = me.getLoginPanel();
        var loginForm = config.down('[name=loginForm]');
        var formIsValid = loginForm.isValid();

        if (formIsValid) {
            me.configData.url = config.down('[name=url]').getValue();
            me.configData.token = config.down('[name=token]').getValue();
        }

        return formIsValid;
    }

});
