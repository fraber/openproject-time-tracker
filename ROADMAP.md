Roadmap for TSTrack Time Tracking
=================================

[//]: # Communicate the product's strategy to stakeholders:
[//]: # Users, developers and OpenProject team

TSTrack Time Tracking provides a user-friendy implementation
of the first crucial step in the financial management process
chain for project management that reaches from capturing time
to progres tracking, budget management, earned value management
and project billing.
TSTrack uses [OpenProject](https://openproject.com) as the
back-end and is 100% open-source (GPL V3, both front-end and
back-end) with enterprise options available.


= V0.1.0: MVP based on TimeEntries (no release defined yet)

Minimal Viable Product to track time in OpenProject:
Uses the OpenProject TimeEntries semantics (just date, user
and work package) instead of interval times to stay 100%
compatible with OpenProject and simplify Panel/Store/Model.

- spentOn DateField apparently writes a Data back into the
  model in the ColumnConfig in
  Ext.grid.plugin.CellEditing.onEditComplete: => change to Y-m-d

- WorkPackges ComboBox:
  - Load WorkPackages store for the selected project on activation
  
- TimeEntryPanel: Fix column configuration and editors
        - Date field doesn't work yet
        - Don't write TimeEntry.updatedAt to server
        - Show PT5H as 5 hours...
        - Load work packages per project on-demand
        - New field activty "activity" : { "href" : "/api/v3/
          time_entries/activities/9",
          "title" : "Development" }
- TimeEntryPanel CRUD:
  - Create new entries
  - Delete entries
  - Save and reload buttons
- Login page
        - Get token from OpenProject
        - Somehow get the current user's ID
- Write data back to server
        - Write comment with format: plain and html:
          "<p>...plain...</p>"
        - Delete data on server
          "delete" : { "href" : "/api/v3/time_entries/27157",
                     "method" : "delete" },
          "updateImmediately" :
          { "href" : "/api/v3/time_entries/27157",
            "method" : "patch" },
          "update" :
          { "href" : "/api/v3/time_entries/27157/form",
             "method" : "post" },

= V0.2.0 (no release defined yet)

- Make grid a grouped grid with groupings as TimeEntries and
  details as TimeIntervalEntries
- Do interval logging with break detection
- Other:
       - Make Electron font bigger and prettier
       - Update to newer version of Electron
       - Create Electron Windows installer
       - Refactor code to move folders below ~/app/
         (for better GitHub display)

Bugs:
- Add a mailto: link for authors to send out emails quickly
- Modifying the date (spentOn) column, the editor writes
  a Date object instead of an ISO date
- After changing the project, the WorkPackages drop-down
  shows the ID of the last WP, instead of the title

ToDo:
- Check that configData.host does not have trailing slash ("/")

= V1.0.0 (no release defined yet)

Communicate project existence to the public:
This is a communication event. The product should have been
ready before.
- Release on GitHub
- Communication from OpenProject(?)
- Inform a few frieds

= V1.1.0 (no release defined yet)

Incorporate feedback from V1.0 launch

= V1.2.0 (no release defined yet)





Done
====

= V0.1.0: MVP based on TimeEntries (WIP)

- Moved main folders below app/ for GitHub display (0.1h)
- Connect stores to OpenProject REST interface (1h)
- Write JSON reader for OpenProject REST format (3h)
- Implemented HTTP basic authentication for all stores (2h)
  - Play with Postman to check OpenProject authentication
  - Debug ExtJS to see where headers are passed
- Increased pageSize to 1000 for all stores (0.5h)
- StoreLoadController: load stores before app launch (1h)
- TimeEntryPanelController: logic for (+)/(-) buttons (1.5h)
- LoginPanelController: Just a stub with some refs (0.5h)
- Start README.md (1h)
- Start ROADMAP.md (1h)
- TimeEntryController: onButtonAdd with SelectionModel (1h)
- Electron (1h)
  - Handle resize
  - Keep window size across sessions


= V0.0.1: Mock-Up with static data (finished 2022-07-09)

Demo the general idea to a wider audience:
Use hard-coded data in order to produce a GUI quickly.

- Get Electron running (3h)
  - Setup GIT repo
  - Understand code from Electron example
  - Problems with recent versions of Electron on Ubuntu 18.04
  - Write package.json, app.js, main.js
  - Load right versions of NPM packages
- Write models and stores (2h)
  - Project Model+Store
  - WorkPackage Model+Store
  - TimeEntry Model+Store
  - Create static demo data for stores above (1)
- Write GUI Panels (1h)
  - MainPanel with buttons
  - LoginPanel with dummy text fields
  - TimeEntriesPanel with Tab configuration
  - AboutPanel with component versions
- Write column configuration for TimeEntryPanel (2h)
  - Projects ComboBox with projects store
  - WorkPackages ComboBox
  - Date and Time fields with config for start-stop
  - Other text fields
  