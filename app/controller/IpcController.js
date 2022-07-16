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

    // This is called before the viewport is created
    init: function() { return this; },

    // This is called after the viewport is created
    onLaunch: function() {
        console.log ('IpcController.onLaunch: Starting');

        // Tray Icon: receives events when clicking on "sync" menu on Tray icon                                                                                            
        ipcRenderer.on('sync', (event, arg) => {
            console.log('IpcController.onSync: arg='+arg);
            console.log(event);
            switch (arg) {
            case 'sync':
                alert('sync: sync');
                break;
            case 'login':
                alert('sync: login');
                break;
            default:
                console.log('IpcController.onLaunch: Unknown IPC sync message from main.js: '+arg);
            }
        });
        console.log ('IpcController.onLaunch: Finished');
    }

});
