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
        { ref: 'loginPanel', selector: '#panel #login'}
    ],

    controllers: {}, // setup during initialization
    
    // This is called before the viewport is created
    init: function() {
        // Set default Electron zoom to 1.0
        const electron = require("electron");
        const browserWindow = electron.remote.BrowserWindow;
        let win = browserWindow.getFocusedWindow();
        win.webContents.setZoomFactor(1.25);
                    
        return this;
    },

    // This is called after the viewport is created
    onLaunch: function() {
        var me = this;
        console.log ('IpcController.onLaunch: Starting');

        // Tray Icon: receives events when clicking on "sync" menu on Tray icon                                                                                            
        ipcRenderer.on('sync', (event, arg) => {
            console.log('IpcController.onSync: arg='+arg);
            console.log(event);
            switch (arg) {
            case 'sync':
                // alert('sync: sync');
                break;
            case 'login':
                // alert('IpcController.onSync');
                var loginController = me.controllers.loginPanelController;
                console.log(loginController);
                loginController.login();
                break;
            default:
                console.log('IpcController.onSync: Unknown IPC sync message from main.js: '+arg);
            }
        });
        console.log ('IpcController.onLaunch: Finished');
    }

});
