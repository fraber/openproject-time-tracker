/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Ipc Controller - Handle Inter-Process Communication with Electron
*/
Ext.define('TSTrack.controller.IpcController', {
    extend: 'Ext.app.Controller',
    id: 'ipcController',

    refs: [
        { ref: 'mainPanel', selector: '#mainPanel'},
        { ref: 'tabPanel', selector: '#tabPanel'},
        { ref: 'loginPanel', selector: '#panel #login'},
        { ref: 'buttonDebug', selector: '#buttonDebug'}
    ],

    debug: 0,
    controllers: {},	// List of controllers, setup during init
    
    // This is called before the viewport is created
    init: function() {
	var me = this;
        if (me.debug > 0) console.log ('IpcController.init: Starting');
        // Set default Electron zoom to 1.0
        const electron = require("electron");
        const browserWindow = electron.remote.BrowserWindow;
        let win = browserWindow.getFocusedWindow();
        win.webContents.setZoomFactor(1.25);

        this.control({
            '#buttonDebug': { click: this.onButtonDebug }
        });

        if (me.debug > 0) console.log ('IpcController.init: Finished');
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        var me = this;
        if (me.debug > 0) console.log ('IpcController.onLaunch: Starting');

        // Receives 'msg' events from main.js process (Tray Icon and operating system)
        ipcRenderer.on('msg', (event, arg) => {
            if (me.debug > 0) console.log('IpcController.onMsg: arg='+arg);
            if (me.debug > 0) console.log(event);
            switch (arg) {
            case 'login':
                var loginController = me.controllers.loginPanelController;
                loginController.login();
                break;
            case 'noop':
                break;
            default:
                console.error('IpcController.onMsg: Unknown IPC msg from main.js: '+arg);
            }
        });
        if (me.debug > 0) console.log ('IpcController.onLaunch: Finished');
    },
   
    /**
     * Toggle (show/hide) the Developer Tools of Electron
     */
    onButtonDebug: function() {
        var me = this;
        if (me.debug > 0) console.log ('TimeEntryPanelController.onButtonDebug: Starting');

        // Send an IPC-event to the main.js process
        ipcRenderer.send('openDevTools');
        // me.getButtonDebug().hide();
        
        if (me.debug > 0) console.log ('TimeEntryPanelController.onButtonDebug: Finished');
    }

});
