/**
 * About panel with some information about the application
 */
Ext.define('TSTrack.view.AboutPanel', {
    alias:  'aboutPanel',
    extend: 'Ext.panel.Panel',
    title: 'About',
    bodyPadding: 10,
    // ToDo: mailto: doesn't work. electron handles it as a local file */
    html: [
            	        'OpenProject Time Tracking',
            	        'Version 1.0.0',
            	        'Copyright &copy; 2022 Frank Bergmann (fraber@fraber.de)',
            	        'This code is licensed under the GNU GPL version 2.0 or later',
            	        '',
            	        '<table>' +
            	            '<tr><td>Node version</td><td>'     + node_version     + '</td></tr>' +
            	            '<tr><td>Chrome version</td><td>'   + chrome_version   + '</td></tr>' +
            	            '<tr><td>Electron version</td><td>' + electron_version + '</td></tr>' +
            	            '<tr><td>ExtJS version</td><td>'    + extjs_version    + '</td></tr>' +
            	        '</table>'
    ].join('<br/>')
});
