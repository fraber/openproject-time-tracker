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
    debug: 0,
    controllers: {},
    
    items: {
        xtype: 'form',
        itemId: 'config',
        id: 'loginForm',
        name: 'loginForm',
        bodyPadding: 5,
        defaults: {
            anchor: '100%',
            xtype: 'textfield',
            allowBlank: false
        },
        items: [{
            xtype: 'fieldset',
            title: 'Login',
            layout: 'anchor',
            padding: 4,
            defaults: { anchor: '95%' },
            items: [{
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
            }, {
                xtype: 'label',
                html: '<h3>Server Host and Token</h3><div width="60%">\
<p><b>Server Host</b> is the URL of your OpenProject server host. Please see<br> \
<a href="https://www.openproject.org/docs/installation-and-operations/">https://www.openproject.org/docs/installation-and-operations/</a><br>\
for instructions on how to setup your own OpenProject instance.</p>\
<p><b>Token</b> refers to the "API" token that is available in:<br>\
[User] -> My account -> Access tokens -> API.<br>\
Please click on the "Reset" or "Generate" button in the second line<br>\
at the right.</div>'
            }]
        }],
        buttons: [
            {text: 'Test Login', id: 'buttonTestLogin', action: 'test_login', hidden: true},
            {text: 'Login', id: 'buttonLogin', action: 'login', hidden: false}
        ]
    }

});

