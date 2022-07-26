/*
 * OpenProject Time Tracker
 * Copyright (c) 2022 Frank Bergmann (fraber@fraber.de)
 * This code is licensed under the GNU GPL version 2.0 or later
 *
 * This is the electron initialization script.
 * It creates a tray icon to control de application.
 */

const {app, Menu, Tray, BrowserWindow, ipcMain} = require('electron')

let tray = null	  		       		// Global reference to Tray Icon
let win = null					// Global reference to main window

/*
 * This is the "main" process of Electron, which has rights to
 * communicate with the operating system, but which can't show
 * anything.
 * So we'll setup and create the "render" process of Electron
 * that will show the actual application.
 */

function createWindow () {
    // Persistent state
    const ElectronStore = require('electron-store');
    const stateStore = new ElectronStore({ name: 'state' });
    w = stateStore.get('win.width', 600)
    h = stateStore.get('win.height', 800)

    // Create the browser window.
    win = new BrowserWindow({
        title: 'OpenProject Time Tracker',
        icon: './images/window.png',
	// icon: path.join(__dirname, '/icon/Icon-512x512.png'),
        show: false,
        width: w,
	height: h,
	webPreferences: {			// Electron 5.0: nodeIntegration default false
            nodeIntegration: true
        }
    })

    win.loadFile('app/index.html')		// and load the index.html of the app.
    win.webContents.openDevTools()		// Open the DevTools.

    // The user pressed the close button: cleanup
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    // The user resized the window: persist the new size
    win.on('resize', () => {
        s = win.getSize()
        stateStore.set({win:{width:s[0],height:s[1]}})
    })

    // Allow the "browser" window to open the Electron debugger
    ipcMain.on('openDevTools', (event, title) => {
	win.webContents.openDevTools();
    })
}


// Basic window handling for TrayIcon
function showWindow () { if (win === null) { createWindow() } else { win.show() } }
function hideWindow () { if (win !== null) { win.hide() } }
function closeWindow () { if (win !== null) { win.close() } }
function toggleWindow () { if (win === null) { createWindow() } else if (win.isVisible()) { win.hide() } else { win.show() } }

// Inter-Process communication
function msg (arg1, arg2, arg, verb) {
    if (!verb) verb = 'noop';                   // No operation

    if (win === null) { createWindow() }
    win.webContents.send('msg', verb);		// Send an IPC event to the Browser window
}

function create_tray_icon () {
    tray = new Tray('./app/images/tray.png')
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Show', click: showWindow},
        {label: 'Hide', click: hideWindow},
        {label: 'Toggle Window', click: toggleWindow},
        {label: 'Quit', click: closeWindow}
    ])
    tray.setToolTip('TSTrack - OpenProject Time Tracker')
    tray.setContextMenu(contextMenu)

    // Works in Windows, but not in Linux
    tray.on('click', toggleWindow)

    // Create window and start application, but don't show by default
    createWindow();

    // Show the windows. This is for better debugging...
    showWindow();

    // Delayed login
    setTimeout(function(){
        msg(null, null, null, 'login');                          // Send "login" message
    }, 1500);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', create_tray_icon)

