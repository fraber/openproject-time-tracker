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
        { ref: 'loginPanel', selector: '#panel #login'}
    ],

    /* Default values for the configuration data */
    configDefaults: {
        url:        'https://community.openproject.org',
        email:      'f.bergmann@openproject.com',
        password:   'normal',
        topdir:     './topdir',
        token:      '0b4c1f6619c4ab3e8ac2c2007b59dc3ec18df9df0b2e2c72e013cdd8ac95201c'
    },

    // This is called before the viewport is created
    init: function() {
        console.log ('TimeEntryPanelController.init: controller initialization');
        this.control({
            '#panel #config field': { change: this.onFieldChanged },
            '#panel toolbar > button': { click: this.onButtonClicked },
            '#panel #projects': { select: this.onProjectSelectedInProjects },
            '#panel #files combobox': { select: this.onProjectSelectedInFiles },
        });
    },

    // This is called after the viewport is created
    onLaunch: function() {
        console.log ('TimeEntryPanelController.onLaunch: controller onLaunch');

        this.initConfiguration ();
        this.recoverState ();
    },

    /* Initialize the configuration data */
    initConfiguration: function () {
        var configPanel = this.getConfigPanel();
        console.log('Gui.initConfiguration: config('+configPanel.id+')');

        const Store = require ('electron-store');
        const configStore = new Store ({name: 'config'});

        // Initialize each configuration value to the saved one
        // or to the default value if none is already saved.
        var defaults = this.configDefaults;
        for (var name in defaults) {
            var d = defaults[name];
            var v = configStore.get(name, d);
            var e = configPanel.down('[name='+name+']');
            e.setValue(v);
            this.configData[name] = v;
            /* Save the configuration value whenever it changes */
            e.on('change', function() {
                var name = this.name;
                var value = this.getValue();
                console.log ('Gui.initConfiguration.onChange('+name+'): changed to '+value+') - saving to configStore');
                configStore.set(name, value);
            });
        }
    },

    /* Recover the application state */
    recoverState: function () {
        var panel = this.getPanel();
        console.log('Gui.recoverState: panel('+panel.id+')');

        const Store = require ('electron-store');
        const stateStore = new Store ({name: 'state'});

        var w = stateStore.get('panel.width', 500);
        var h = stateStore.get('panel.height', 300);
        panel.setSize(w,h);
        panel.on ('resize', function() {
            var s = panel.getSize();
            stateStore.set({panel: s});
        });
    },

    /************************************************************
     * Configuration data changes
     ************************************************************/

    onFieldChanged: function (field, newValue, oldValue, eOpts) {
        var name = field.name;
        console.log ('Gui.onFieldChanged: field('+name+') changed from oldValue('+oldValue+') to newValue('+newValue+') eOpts('+eOpts+')');
        if (name in this.configDefaults && this.configData[name] != newValue) {
            console.log ('Gui.onFieldChanged: field('+name+') changed from('+this.configData[name]+') to('+newValue+')');
            this.configData[name] = newValue;
            this.configData.changed = true;
        }
    },

    /************************************************************
     * Button actions
     ************************************************************/

    onButtonClicked: function (button, event, eOpts) {
        console.log ('Gui.onButtonClicked: button clicked button('+button.getText()+') action('+button.action+') event('+event+') eOpts('+eOpts+')');
        switch (button.action) {
        case 'login':
            console.log('Gui.onButtonClicked: login clicked');
            if (this.formIsValid()) {
                this.connectionController.login();
            } else {
                console.log('Connection.login: form is not valid - cancelling request');
                alert('Form is not valid');
            }
            break;
        case 'projects':
            console.log('Gui.onButtonClicked: projects clicked');
            this.connectionController.loadProjects();
            break;
        case 'sync':
            console.log('Gui.onButtonClicked: sync clicked');
            //this.connectionController.syncExecOperations();
            this.connectionController.syncAll();
            break;
        case 'commit':
            console.log('Gui.onButtonClicked: commit clicked');
            this.connectionController.syncExecOperationsNonEasy();
            break;
        }
    },

    /* Check if the form data is valid */
    formIsValid: function () {
        var config = this.getConfigPanel();

        this.configData.url = config.down('[name=url]').getValue();
        this.configData.email = config.down('[name=email]').getValue();
        this.configData.password = config.down('[name=password]').getValue();
        this.configData.topdir = config.down('[name=topdir]').getValue();
        this.configData.form_is_valid = config.getForm().isValid();

        var msg  = [
            'form ' + (this.configData.form_is_valid ? 'is' : 'is not') + ' valid and '
                + (this.configData.changed ? 'is' : 'is not') + ' changed',
            'URL     : "' + this.configData.url + '"',
            'Email   : "' + this.configData.email + '"',
            'Password: "' + this.configData.password + '"',
            'Topdir  : "' + this.configData.topdir + '"'
        ].join('\n');

        console.log (msg);
        return this.configData.form_is_valid;
    }

});
