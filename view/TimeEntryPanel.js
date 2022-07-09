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
            {text: 'Id', dataIndex: 'id', align: 'right', width: 20},
            
            {text: 'Project', dataIndex: 'project_id', width: 80,
             editor: 'datefield',
             renderer: function(v) {
                 projectStore = Ext.StoreManager.get('Projects');
                 idx = projectStore.find('id', v)
                 model = projectStore.getAt(idx);
                 return model.get('name');
             }
            },
           
            {text: 'Name', dataIndex: 'name', flex: 5},
           
            {text: 'Date', width: 80, dataIndex: 'start',
             editor: 'datefield',  renderer: function(v) { return Ext.Date.format(v, 'Y-m-d'); }
            },

            {text: 'Start', width: 80, dataIndex: 'start',
             editor: 'datefield',  renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
            },

            {text: 'End', width: 80, dataIndex: 'end',
             editor: 'datefield',  renderer: function(v) { return Ext.Date.format(v, 'H:i'); }
            },

            {text: 'Note', dataIndex: 'note', flex: 5}
        ]
    }
});
