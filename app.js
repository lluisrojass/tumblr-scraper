'use strict';
//const reload = require('electron-reload')(__dirname);
require('./components/shared/stringutils'); 
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');
const getPostData = require('./components/main/userpost');
const Loop = require('./components/main/loop');
const ipcTypes = require('./components/shared/ipctypes.json');

// prevent window being garbage collected
let mainWindow;
let loop;

function onClosed() {
	mainWindow = null;
	loop = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 500,
		minWidth: 1000,
		minHeight: 500,
		backgroundColor: '#F9F9F9',
		titleBarStyle:'hidden',
		scrollBounce:true,
		movable:true,
	});
	win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
	win.on('closed', onClosed);
	let webContents = win.webContents;
	loop = new Loop()
		.on('post', pData => {
			getPostData(pData, (err, data) => {
				if (err !== null){
					webContents.send('warning', err);
				}
				else {
					let { datePublished=null, isVideo, articleBody=null, headline=null, image, url='',videoURL=null } = data.post;
					webContents.send('post', {
							type: data.type,
							datePublished: datePublished,
							articleBody: articleBody ? articleBody.rmvMore() : null,
							headline: headline,
							isVideo: isVideo,
							videoURL: videoURL,
							images: image ? image['@list'] || [image] : [],
							url: url
					});
				}
			});
		});

	/* pipe loop event emitted -> webContents.send */
	['page','date','end','timeout','error'].forEach(function(e){
		loop.on(e, function() {
			webContents.send.apply(webContents, [e].concat(Array.prototype.slice.call(arguments, 0)))
		})
	});

	ipcMain.on('asynchronous-message', (event, type, data) => {
		switch(type) {
			case ipcTypes.START_REQUEST:
				const {blogname, types} = data;
				loop.go(types, blogname);
				event.sender.send('asynchronous-reply', ipcTypes.START_RESP);
				break;
			case ipcTypes.CONT_REQUEST:
			 	const didContinue = loop.continue();
				event.sender.send('asynchronous-reply', ipcTypes.CONT_RESP, { didContinue: didContinue });
				break;
			case ipcTypes.STOP_REQUEST: /* response send via loop.on("stopped") listener */
				loop.once('stopped', () => event.sender.send('asynchronous-reply', ipcTypes.STOP_RESP))
				loop.stop();
				break;
			case ipcTypes.OPEN_IN_BROWSER:
				shell.openExternal(data.url);
				break;
		}
	});
	return win;
}

app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
	if (!mainWindow)
		mainWindow = createMainWindow();
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	//mainWindow.webContents.openDevTools();
});
