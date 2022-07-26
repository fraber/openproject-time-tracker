/**
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * About panel with some information about the application
 */

var node_version = process.versions.node;
var chrome_version = process.versions.chrome;
var electron_version = process.versions.electron;
var extjs_version = Ext.getVersion().version;

Ext.define('TSTrack.view.AboutPanel', {
    alias:  'aboutPanel',
    extend: 'Ext.panel.Panel',
    title: 'About',
    bodyPadding: 10,
    html: [
            	        'OpenProject Time Tracking',
            	        'Version 1.0.0',
            	        'Copyright &copy; 2022 Frank Bergmann (<a href="mailto:fraber@fraber.de">fraber@fraber.de</a>)',
            	        'This code is licensed under the GNU GPL version 3.0.',
            	        '',
            	        '<table>' +
            	            '<tr><td>Node version</td><td>'     + node_version     + '</td></tr>' +
            	            '<tr><td>Chrome version</td><td>'   + chrome_version   + '</td></tr>' +
            	            '<tr><td>Electron version</td><td>' + electron_version + '</td></tr>' +
            	            '<tr><td>ExtJS version</td><td>'    + extjs_version    + '</td></tr>' +
            	        '</table>'
    ].join('<br/>')
});
