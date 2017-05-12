'use strict';

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');
const Archive = require('./components/main/archive');
const getPostData = require('./components/main/userpost');
const reload = require('electron-reload')(__dirname);
const { RR_T, A_T } = require('./components/shared/ipcmessagetypes');


// prevent window being garbage collected
let mainWindow;
let archive;

function onClosed() {
	mainWindow = null;
	archive = null;
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
  }))
	win.on('closed', onClosed);
	let webContents = win.webContents;
	archive = new Archive()
		.on('post', postData => {
			getPostData(postData, (err, data) => {
				if (err !== null)
					webContents.send('warning', err);
				else {
					let { datePublished=null, articleBody=null, headline=null, image, url='',video=null } = data.postData;
					webContents.send('post', {
						post: {
							isClicked: false,
							type: data.type,
							datePublished: datePublished,
							articleBody: articleBody,
							headline: headline,
							video: video,
							images: image ? image['@list'] || [image] : [],
							url: url
						}
					});
				}
			});
		});
	/* event emitted -> webContents.send uninterrupted */
	(function(events) {
		events.forEach(function (event) {
    	archive.on(event, function () {
      	webContents.send.apply(webContents, [event].concat(Array.prototype.slice.call(arguments, 0)));
    	});
		})
  })(['page','date','end','timeout','stopped','error']);

	/*
		.on('page', path =>
			webContents.send('page', { path: path });
		)
		.on('date', dateString =>
			webContents.send('date', {date, dateString})
		)
		.on('error', (urlInfo) =>
			webContents.send('error', {
				msg: `${urlInfo.message} (${urlInfo.host}${urlInfo.path}).`
			})
		)
		.on('end', () =>
			webContents.send('end')
		)
		.on('timeout', () =>
			webContents.send('timeout')
		)
		.on('post', postInfo => {
			getPostData(postInfo, (err, data) => {
				if (err !== null)
					webContents.send('warning', {msg: `Error: ${err.msg} requesting ${err.path}.`});
				else {
					let { datePublished=null, articleBody=null, headline=null, image, url='',video=null } = data.postData;
					webContents.send('post', {
						post: {
							isClicked: false,
							type: data.type,
							datePublished: datePublished,
							articleBody: articleBody,
							headline: headline,
							video: video,
							images: image ? image['@list'] || [image] : [],
							url: url
						}
					});
				}
			});
		});*/

		ipcMain.on('asynchronous-message', (event, type, data) => {
			switch(type) {
				case RR_T.START_REQUEST:
					const {blogname, types} = data;
 					archive.go(blogname, types);
					event.sender.send('asynchronous-reply', RR_T.START_RESPONSE, null);
					break;
				case RR_T.CONTINUE_REQUEST:
				 	const didContinue = archive.continue() ? true : false;
					event.sender.send('asynchronous-reply', RR_T.CONTINUE_RESPONSE, {didContinue: didContinue});
					break;
				case RR_T.STOP_REQUEST: /* response send via archive.on("stopped") listener */
					archive.stop();
					break;
				case RR_T.OPEN_IN_BROWSER:
					shell.openExternal(data.url);
					break;
			}
		});

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
	mainWindow.webContents.openDevTools();
});
