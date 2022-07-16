TSTrack Time Tracking Roadmap
=============================

= V1.0.0
- Login page
        - Get token from OpenProject
        - Somehow get the current user's ID
- TimeEntryPanel: Create new entries
- TimeEntryPanel: Fix grid fields
        - Date field doesn't work yet
        - Don't write TimeEntry.updatedAt to server
        - Show PT5H as 5 hours...
        - Load work packages per project on-demand
        - New field activty "activity" : { "href" : "/api/v3/time_entries/activities/9", "title" : "Development" }
- Write data back to server
        - Write comment with format: plain and html: "<p>...plain...</p>"
        - Delete data on server
          "delete" : { "href" : "/api/v3/time_entries/27157", "method" : "delete" },
          "updateImmediately" : { "href" : "/api/v3/time_entries/27157", "method" : "patch" },
          "update" : { "href" : "/api/v3/time_entries/27157/form", "method" : "post" },

= V1.1.0
- Make grid a grouped grid with groupings as TimeEntries
  and details as TimeIntervalEntries
- Do interval logging with break detection
- Other:
       - Make Electron font bigger and prettier
       - Update to newer version of Electron
       - Create Electron Windows installer
       - Refactor code to move folders below ~/app/
         (for better GitHub display)

- Add a mailto: link for authors to send out emails quickly


Done
====

= V0.1.0: MVP based on TimeEntries (WIP)

This is the very first version that can be used to enter
time information into OpenProject.
This version uses TimeEntries from OpenProject (just
date, user and work package) instead of interval times
in order to make the semantics of the data directly
compatible.

- Connect stores to OpenProject REST interface (1h)
- Write JSON reader for OpenProject REST format with links (3h)
- Implemented HTTP basic authentication for all stores (2h)
  - Play with Postman to check OpenProject authentication
  - Debug ExtJS to see where headers are passed
- Increased pageSize to 1000 for all stores (0.5h)
  - Project field doesn't get all 57 projects - deal with pagination
- StoreLoadController: make sure stores are loaded on launch (1h)
- TimeEntryPanelController: logic for (+)/(-) buttons (1.5h)
- LoginPanelController: Just a stub with some refs (0.5h)
- Start README.md (1h)
- Start ROADMAP.md (1h)
- TimeEntryController: onButtonAdd with SelectionModel (1h)
- Electron (1h)
  - Handle resize
  - Keep window size across sessions


= V0.0.1: Mock-Up with static data (8h)

This is a mock-up with static hard-coded data in order
to demo the general idea.

- Setup GIT repo
- Get Electron running (3h)
  - Understand code from Electron example
  - Problems with recent versions of Electron on Ubuntu 18.04
  - Write package.json, app.js, main.js
  - Load right versions of NPM packages
- Write Models and stores for Project, WorkPackage and TimeEntry (1h)
- Create static data for 3x stores (1h)
- Write GUI with panels: Main, Login, TimeEntries and About (2h)
- Write column configuration for TimeEntries panel (2h)
  - ComboBox with projects store
  - Column configuration for other fields
  