/**
 * List of projects
 * Currently not used, because moving it creates an error
 */
Ext.define('TSTrack.view.TimeEntryPanel', {
    alias:  'timeEntryPanel',
    extend: 'Ext.panel.Panel',
    id: 'time_entry_panel',
    itemId: 'time_entry_panel',
    title: 'Time Entry',
    items: {
        xtype: 'grid',
        itemId: 'time_entries',
        store: 'TimeEntries',
        emptyText: 'No time entries available',
        columns: [
            {text: 'Id', dataIndex: 'id', align: 'right', flex: 1},
            {text: 'Name', dataIndex: 'project_name', flex: 7}
        ]
    }
});

