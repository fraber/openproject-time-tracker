/*
 * Handle user interactions in the TimeEntryPanel
 *
 * - We need to enable/disable the add/del buttons depending
 *   on the type of line currently selected
*/
Ext.define('TSTrack.controller.TimeEntryPanel', {
    extend: 'Ext.app.Controller',
    id: 'timeEntryPanelController',

    refs: [
        { ref: 'mainPanel', selector: '#mainPanel'},
        { ref: 'tabPanel', selector: '#tabPanel'},
        { ref: 'loginPanel', selector: '#panel #login'},
        { ref: 'filterSelector', selector: '#panel #syncdir combobox'}
    ],

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

        this.projectsStore = this.getProjects().getStore();
        this.remoteDirStore = this.getFiles().getStore();
        this.localDirStore = this.getLocalDir().getStore();

        var app = this.getApplication();
        this.connectionController = app.getController('Connection');

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

    /************************************************************
     * Window management
     ************************************************************/

    /* Hide the window but keep the tray icon */
    hideWindow: function () {
        console.log('Gui.hideWindow');
        const { remote } = require('electron');
        /* FIXME: should be the Gui window of this controller's application */
        remote.BrowserWindow.getFocusedWindow().hide();
    },

    /**
     * Close the window and remove the tray icon
     */
    closeWindow: function () {
        console.log('Gui.closeWindow');
        const { remote } = require('electron');
        /* FIXME: should be the Gui window of this controller's application */
        remote.BrowserWindow.getFocusedWindow().close();
    },


    /************************************************************
     * GUI Status
     ************************************************************/

    /**
     * Close the window and remove the tray icon
     */
    tabsAndButtons: function (tabs, buttons, activeTab) {
        console.log('Gui.tabsAndButtons: tabs='+tabs+', buttons='+buttons+', activeTab='+activeTab);

        // Main panel
        var tabPanel = Ext.getCmp('tabpanel');

        // Tabs
        var loginTab = tabPanel.child('#login_tab');
        var syncTab = tabPanel.child('#sync_tab');
        var projectsTab = tabPanel.child('#projects_tab');
        var localTab = tabPanel.child('#local_files');
        var remoteTab = tabPanel.child('#remote_files');

        if (tabs.length > 0) {
            loginTab.tab.hide();
            syncTab.tab.hide();
            projectsTab.tab.hide();
            localTab.tab.hide();
            remoteTab.tab.hide();

            if (tabs.includes("login")) loginTab.tab.show();
            if (tabs.includes("sync")) syncTab.tab.show();
            if (tabs.includes("projects")) projectsTab.tab.show();
            if (tabs.includes("local")) localTab.tab.show();
            if (tabs.includes("remote")) remoteTab.tab.show();
        }

        if (activeTab) {
            switch (activeTab) {
            case 'login': tabPanel.setActiveTab(loginTab); break;
            case 'sync': tabPanel.setActiveTab(syncTab); break;
            }
        }

        
        // Buttons
        var loginButton = Ext.getCmp('button_login');
        var syncButton = Ext.getCmp('button_sync');
        var commitButton = Ext.getCmp('button_commit');
        var commitText = Ext.getCmp('textfield_commit');

        if (buttons.length > 0) {
            loginButton.hide();
            syncButton.hide();
            commitButton.hide();
            commitText.hide();

            if (buttons.includes("login")) loginButton.show();
            if (buttons.includes("sync")) syncButton.show();
            if (buttons.includes("commit")) commitButton.show();
        }
        
        console.log('Gui.tabsAndButtons: finished');
    },

    
});
