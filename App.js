'use strict';

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const reload = require('electron-reload')(__dirname);

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 500,
		resizable:false
	});

	win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => app.quit() );

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
