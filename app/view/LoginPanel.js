/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Panel for entering Login information
 */

/**
 * A simple form to enter a URL and an access token.
 * Both values are stored in the "electron-store" on
 * the desktop.
 */
Ext.define('TSTrack.view.LoginPanel', {
    alias:  'loginPanel',
    extend: 'Ext.panel.Panel',
    title: 'Login',
    id: 'loginPanel',
    items: {
        xtype: 'form',
        itemId: 'config',
        id: 'loginForm',
        name: 'loginForm',
        bodyPadding: 0,
        defaults: {
            anchor: '100%',
            xtype: 'textfield',
            allowBlank: false
        },
        items: [
            {
                xtype: 'textfield',
                name: 'host',
                inputType: 'url',
                regexp: '/(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/',
                fieldLabel: 'Server Host',
                emptyText: 'http://192.168.0.1:8000 - the host name of your OpenProject server',
            }, {
                xtype: 'textfield',
                name: 'token',
                inputType: 'text',
                fieldLabel: 'Token',
                emptyText: 'M3MmUwM5NTIwMWM= - really long token from OpenProject'
            }
        ],
        buttons: [
            {text: 'Test Login', id: 'buttonTestLogin', action: 'test_login', hidden: true},
            {text: 'Login', id: 'buttonLogin', action: 'login', hidden: false}
        ]
    }

});

