Roadmap for TSTrack OpenProject Time Tracking
=============================================

TSTrack implements time tracking as the first step
a financial management process chain for projects.

- V0.3.0: Container for additional features: In planning
- V0.2.0: Start/Stop with grouping: In planning
- V0.1.0: MVP witout start/stop: In development, no release date yet
- V0.0.1: Static mock-up: Released


= V0.1.0: MVP based on TimeEntries (no release defined yet)

Minimal Viable Product to track time in OpenProject:
Uses the OpenProject TimeEntries semantics (just date, user
and work package) instead of interval times to stay 100%
compatible with OpenProject and simplify Panel/Store/Model.

- TimeEntryPanel: Fix column configuration and editors
	- Show PT5H as 5 hours...
	- New field activty "activity"
- Editing:
	- Save only when valid (at least with valid WorkPackage)
	- Show error message when saving(?)
	- Save edited values with:
		- cell.change (excluding Project)?
		- selection.change?
- Handle strange data:
	- Projects without work packages(?)
	- When connected to test database from Jens

Bugs:
	- WPs are shown as numbers in some situations.
	  Create debugging tab with WorkPackages?


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
	- Login page
	- Show the user data in the login screen in grey
	  (because they are defined on the OpenProject side)
	- WorkPackage select: Deal with community.op.org
	  5000 WPs using search while you type

Bugs:
- Add a mailto: link for authors to send out emails quickly
- After changing the project, the WorkPackages drop-down
  shows the ID of the last WP, instead of the title
- Saving an entry with empty WP causes OP API error
  (because workPackageId is integer with default 0)

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
- TimeEntryPanel: Fix column configuration and editors
	- spentOn DateField writes a Data instead of a
	  Y-m-d string in CellEditing.onEditComplete (0.2h)
	- Don't write TimeEntry.updatedAt to server (0.1h)
	- Load work packages per project on-demand (0.1)
- LoginPanelController:
	- Just a stub with some refs (0.5h)
	- Get user ID (0.5h)
	- Stores: Load with OP token (1h)
- Start README.md (1h)
- Start ROADMAP.md (1h)
- TimeEntryController: onButtonAdd with SelectionModel (1h)
- Electron (1h)
  - Handle resize
  - Keep window size across sessions
- WorkPackges ComboBox: Load WPs after project change (1h)
- Rewrite of Reader and Writer for OpenProject API (7h)
- Date-picker for log date writes Date instead of a ISO date
  string: changed type of column to Date (0.5h)
- Customized AJAX Proxy to create custom URL for update
  to TimeEntry API (1h)
- Implemented DELETE, selecting next item after delete (1h)
- Implemented ADD, with single object parsing in OPReader and
  modified mapping in OPWriter (3h)



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
  - Projects ComboBox with ProjectStore
  - WorkPackages ComboBox
  - Date and Time fields with config for start-stop
  - Other text fields
  