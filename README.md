TSTrack Time Tracker for OpenProject
====================================

Desktop time tracker integrated with OpenProject

![screenshot](/app/images/screenshot.png?raw=true "Screenshot")

#### Features
* time tracking per hour with Excel style editor
* desktop application with tray icon for Windows, Linux and Mac
* 100% open-source (GPL V3)
* integration with [OpenProject](https://openproject.com)
  back-end (GPL V3)

#### Features - available soon
* start-stop timer and time tracking per minute
* idle time detection
* calendar view with drag-and-drop editing
* export as CSV


# Quick start

1. Install TSTrack:<br>
   These instrunctions work for any recent Linux variant,
   please see below for Windows and Mac.<br>
   ```
   git clone git@github.com:fraber/openproject-time-tracker.git
   npm install
   npm start
   ```

2. Setup some OpenProject account:<br>
   [Install OpenProject locally](https://www.openproject.org/docs/installation-and-operations/)
   or create an account on the [OpenProject community server](https://community.openproject.org).
   Click "Sign in" and "Create a new account".

3. Get the OpenProject API token:<br>
   In OpenProject go to Profile image -> My Account ->
   Access tokens and identify the line with "API".
   Click on Create or Reset in the Action column and
   copy the token.

4. Enter credentials in TSTrack:<br>
   Enter the host name of your server and your API token in
   the TSTrack login page.

5. Start logging hours



# Enterprise Operations

As an enterprise you want to
[run your own OpenProject server](https://www.openproject.org/docs/installation-and-operations/)
or contract a [cloud server](https://www.openproject.org/pricing/?mode=cloud).
OpenProject is 100% open source (GPL V3) and the community
edition is sufficient for TSTrack (see limitations below).

https://www.openproject.org/docs/installation-and-operations
The rest basically works like above.

### Enterprise options available

* support contracts and other technical and legal options
* dual-licensing under different license terms
* GUI customization (use your corporate identity/design)
* option to store start-stop times on the server side
  (see limitations below)
* please contact the author (fraber@fraber.de) for details


# Limitations

Currently:
* Only 1000 objects can be loaded for ProjectStore,
  WorkPackageStore or TimeEntryStore per week.
* OpenProject + TSTrack standard edition are built
  for <200 users tracking time concurrently.
  Please contact us for larger organizations.
* OpenProject community does not have the infrastructure
  (data-model, API, reports, ...) to handle start-stop
  information on the server side. It can store the amount
  of time spent on a task (for example: 5 hours),
  but not that these 5 hours were spent from 9:00am to
  1:00pm and from 3:00pm to 4:00pm.
* To work around this limiatation, TSTrack stores the
  start-stop details on the desktop's local storage
  (not on the server).
* To work around this limiation, please contact the
  author for enterprise options (fraber@fraber.de).


# Installers for Windows and Mac

* will soon be available, please contact fraber@fraber.de


# Development

* TSTrack is written in 100% JavaScript based on
  [Electron](https://electronjs.org) (a desktop version
  of the open-source Chromium browser) using the
  ExtJS 4.2 JavaScript library.
* This GitHub repo contains everything you need to
  develop and to create new versions.
* ToDo: Only include the minified version of the ExtJS
  libraries
* ToDo: Explain how to get the GPL V3 version of ExtJS
