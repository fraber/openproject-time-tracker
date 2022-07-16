/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * Panel for entering Login information
 */

/*
 * A custom form field to select a local directory.
 */
Ext.define('Ext.ux.DirField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.dirfield',

    /* Clicking the button opens a select directory dialog provided by electron */
    onTriggerClick: function() {
        const {dialog} = require('electron').remote;
        var path = dialog.showOpenDialog({
            title: 'Select the top directory to synchronize',
            properties: ['openDirectory']
        });
        if (path)
            this.setValue (path);
    }
});



Ext.define('TSTrack.view.LoginPanel', {
    alias:  'loginPanel',
    extend: 'Ext.panel.Panel',
    title: 'Login',
    items: {
        xtype: 'form',
        itemId: 'config',
        bodyPadding: 0,
        defaults: {
            anchor: '100%',
            xtype: 'textfield',
            allowBlank: false
        },
        items: [
            {
                name: 'url',
                inputType: 'url',
                // vtype: 'url',
                regexp: '/(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/',
                fieldLabel: 'Server URL',
                emptyText: 'The URL of your OpenProject server',
            }, {
                name: 'email',
                inputType: 'email',
                vtype: 'email',
                fieldLabel: 'Email',
                emptyText: 'The email to use as login name',
            }, {
                name: 'password',
                inputType: 'password',
                fieldLabel: 'Password',
                emptyText: 'Your login password (WARNING! Currently stored locally in clear text!)',
            }, {
                name: 'topdir',
                xtype: 'dirfield',
                fieldLabel: 'Local directory',
                emptyText: 'Click the arrow to select the local directory to sync',
            }
        ],
        buttons: [
            {text: 'Login', id: 'buttonLogin', action: 'login', hidden: false}
        ]
    }

});

