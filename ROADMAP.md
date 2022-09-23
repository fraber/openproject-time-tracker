Roadmap for TSTrack OpenProject Time Tracking
=============================================

- V0.4.0: Add start/stop entries with grouping: Planning
- V0.3.0: Release installers for Win, Linux and Mac: Planning
- V0.2.0: Add a monthly chart: Planning
- V0.1.0: MVP without start/stop: In development
- V0.0.1: Static mock-up: Released


# V0.1.0: MVP based on TimeEntries: In Development

Minimal Viable Product to track time in OpenProject:
Uses the OpenProject TimeEntries semantics (just date, user
and work package) instead of interval times to stay 100%
compatible with OpenProject and simplify Panel/Store/Model.

ToDo:
- TimeEntryPanel: Fix column configuration and editors
	- Show PT5H as 5 hours...
	- New field activty "activity"
- Handle edge cases:
	- Projects without work packages(?)
	- Only show projects where you can log hours:
	  https://www.openproject.org/docs/api/endpoints/time-entries/
	  There is /api/v3/time_entries/available_projects
	  that returns only suitable projects.
	- Test with database from Jens
- Check ToDo's in the source code
- Bugs:
	- When adding multiple new entries, there may be
	  unforeseen behavior when saving, and multiple error
	  messages from the server (Operation.Exceptions)
        - When creating a new line/entry the red triangles
	  don't appear yet even though data is not yet saved.
	- Check that configData.host does not have trailing slash ("/")
	- Remove sync code in main.js and other places
	- Check/remove duplicate "limit" code to set store page size

# V0.2.0: Add a monthly chart: Planning

- Monthly chart:
	- Create a vertial bar chart with logged hours per day
	  with stacked graph with hours per project/work package(?)
	- Allows to chosse the user to show(?)
	- Allow to choose reporting periods last week etc.
	- Use-cases / questions users might have:
	  - "Did I enter something incorrectly?"
	  - Re-distribute time across work packages
	  - Clean up hours of multiple users for team manager
- Add option to see/edit hours for different users
- Add a (+) button on each line to allow users to create dups
- Allow to log/see hours for multiple users?
  Is there a list of users who I may impersonate?
- Add selector for themes(?)


# V0.3.0: Release installers for Win, Linux and Mac: Planning

- Just create and publish three installers.


# V0.4.0: Add start/stop entries with grouping: Planning

- Make grid a grouped grid with groupings as TimeEntries and
  details as TimeIntervalEntries
- Do interval logging with break detection
- Weekly chart:
	- Use the ExtJS calendar view and create calendar
	  entries for the start/stop time entries
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

## V0.1.0: MVP based on TimeEntries (WIP)

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
- Implemented ADD, with single object parsing in
  OpenProjectReader and modified mapping in
  OpenProjectWriter (3h)
- Moved from automatic to manual sync of TimeEntryStore (3h)
  - Set TimeEntryStore.autoSynt to false
  - Set up TimeEntry.validate() to check (partially) whether
    the OpenProject server would be able to accept the object.
  - Added logic in CellSelectionModel.onCellChange to save
    the time entry only if the model is valid.
- Editing: fixed with the change above:
	- Save only when valid (at least with valid WorkPackage)
	- Show error message when saving(?)
	- Save edited values with:
		- cell.change (excluding Project)?
		- selection.change?
- Fixed with the one above:
  After changing the project, the WorkPackages drop-down
  shows the ID of the last WP, instead of the title.
- Saving an entry with empty WP causes OP API error
  (because workPackageId is integer with default 0).
  Fixed with the one above
- WPs are shown as numbers in some situations.
  Create debugging tab with WorkPackages?
  Fixed with the one above
- TimeEntryPanelController.onCellChange:
	- isValid() doesn't check PT5H...
	- A failing sync() returns an undefined
	  success callback variable.
  Fixed with the one above
- Fixed parsing error messages from OpenProject server (3h)
  OpenProject returns an error object when trying to save
  hours on a project where the user doesn't have permissions.
  The default JsonReader doesn't handle this configuration.
  It handles 200 responses, but 4XX responses are hard-coded.
  The solution was to overwrite the Proxy.setException()
  method in the TimeEntryStore to achieve the correct
  behavior.
  - Also fixed:
    - Trying to log hours to a project without permsissions
      causes a correct error message from the server, which
      is not correctly interpreted yet.
- Add a mailto: link for authors to send out emails (0.2h)
- Add a button to enable/disable the debugger (0.5h)


## V0.0.1: Mock-Up with static data (released 2022-07-09)

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
  