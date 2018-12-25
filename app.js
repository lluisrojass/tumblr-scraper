'use strict';

const { join } = require('path');
const { format } = require('url');
const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const getPostData = require('./src/main/user-post');
const Loop = require('./src/main/loop');
const Throttle = require('./src/main/throttle');
const { IPC, MAIN_EVENTS } = require('./src/shared/constants');

if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname);
}

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
        titleBarStyle: 'hidden',
        title: 'Tumblr Scraper',
        scrollBounce: true,
        darkTheme: true,
        movable: true
    });
	
    win.loadURL(format({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', onClosed);

    let webContents = win.webContents;

    webContents.once('dom-ready', () => { 
        /* throttle init */
        webContents.send(
            IPC.PACKAGE.ASYNC_REPLY,
            IPC.EVENTS.RESPONSE.THROTTLE,
            loop.getThrottle()
        );
    });

    loop = new Loop().on('post', pData => {

        getPostData(pData, (err, data) => {

            if (err !== null)
                webContents.send('warning', err);
            
            else {
				
                let {
                    datePublished = null, 
                    isVideo, 
                    articleBody= null, 
                    headline = null, 
                    image, 
                    url = '',
                    videoURL = null 
                } = data.post;

                webContents.send('post', {
                    type: data.type,
                    datePublished,
                    articleBody: articleBody ? articleBody.rmvMore() : null,
                    headline,
                    isVideo,
                    videoURL,
                    images: image ? image['@list'] || [image] : [],
                    url
                });
                
                if (image != null) {
                    Throttle.onDiscovery();
                }
            }
        });
    });

    /* pipe: loop event emitted -> webContents.send */
    ['page','date','end','timeout','error'].forEach(function(e) { 
        loop.on(e, function() {
            webContents.send.apply(
                webContents, 
                [e].concat(Array.prototype.slice.call(arguments, 0))
            );
        });
    });

    /* handle ipc requests */
    ipcMain.on(IPC.PACKAGE.ASYNC_REQUEST, (event, type, data) => {
        switch(type) {
            case IPC.REQUESTS.START: {
                const { blogName, types } = data;
                loop.go(blogName, types);
                event.sender.send(
                    IPC.PACKAGE.ASYNC_REPLY, 
                    IPC.EVENTS.RESPONSE.START
                );
                break;
            }                

            case IPC.REQUESTS.CONTINUE: {
                const didContinue = loop.continue();
                event.sender.send(
                    IPC.PACKAGE.ASYNC_REPLY, 
                    IPC.EVENTS.RESPONSE.CONTINUE,
                    { didContinue }
                );
                break;
            }

            case IPC.REQUESTS.STOP: {
                loop.once(MAIN_EVENTS.STOPPED, () => (
                    event.sender.send(
                        IPC.PACKAGE.ASYNC_REPLY, 
                        IPC.EVENTS.RESPONSE.STOP
                    )
                )).stop();
                break;
            }

            case IPC.REQUESTS.OPEN_IN_BROWSER: {
                shell.openExternal(data.url);
                break;
            }

            /*
            case 'IMAGE_LOADED':
                Throttle.onLoad();
                break;
            
            case 'THROTTLE_TOGGLE':
                loop.toggleThrottle();
                event.sender.send('asynchronous-reply', 'THROTTLE_RESPONSE');
                break;
            */

        }
    });
    
    addMenu();
	
    return win;
}

function addMenu() {

    const template = [
        {
            label:'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' } ]
        },
        {
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () { shell.openExternal('https://github.com/lluisrojass/tumblr-scraper'); }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}


app.on('window-all-closed', () => app.quit());


app.on('activate', () => {
    if (!mainWindow)
        mainWindow = createMainWindow();
});

app.on('ready', () => {
    mainWindow = createMainWindow();
    if (process.env.NODE_ENV === 'development') 
        mainWindow.webContents.openDevTools();
});
