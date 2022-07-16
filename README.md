
TSTrack Time Tracker for OpenProject
====================================

Desktop time tracker integrated with OpenProject

[screenshot]


### Features - currently available
* desktop application with tray icon for Windows, Linux and Mac
* 100% open-source (GPL V3)
* time tracking per hour with Excel style cell editing
* integration with [OpenProject](https://openproject.com)

### Features - available soon
* time tracking with start-stop timer
* idle time detection
* calendar view with drag-and-drop
* export as CSV


# Quick start for a single user

1. Setup an account at the public OpenSource server
   https://community.openproject.org.
   Click on "Sign in" -> "Create a new account"

2. Install TSTrack (on Linux, please see below for Windows and Mac):
   git clone htts://github.com/fraber/tstrack
   npm install
   npm start

3. Enter your name and credentials in the TSTrack login page

4. Start logging hours

community.openproject.org does not allow you to create your
own projects or work packages, so please see the next section.


# Quick start for enterprise (big and small)

As an enterprise, you basically want to run your own
[OpenProject](https://openproject.com) server. Please visit:
https://www.openproject.org/docs/installation-and-operations/installation/
The rest basically works like above.

OpenProject is 100% open source (GPL V3), and for community
edition is sufficient for TSTrack (see limitations below).


# Enterprise Options

* support contracts and other technical and legal options
* dual-licensing under different license terms
* use your CI/CD for the TSTrack GUI
* option to store start-stop times on the server side
  (see limitations below)
* please contact mailto:fraber@fraber.de for details


# Limitations

* Only 1000 objects can be loaded for Projects,
  WorkPackages or TimeEntries per week.
* OpenProject + TSTrack standard edition are built
  for <200 users tracking time concurrently.
  Please contact us (mailto:fraber@fraber.de) for larger
  organizations.
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


# Installation

* Currently, you have to install TSTrack manually as
  described in the Quick start.
* Being based on [Electron](https://electronjs.org),
  we are working to create installers for Windows,
  Linux and Mac.


# Development

* TSTrack is written in 100% JavaScript based on
  [Electron](https://electronjs.org) (a desktop version
  of the open-source Chromium browser) using the
  ExtJS 4.2 JavaScript library.
* This GitHub repo contains everything you need to
  develop and to create new versions.
