const config = require('./config.json');
const {app, BrowserWindow, ipcMain, shell, Menu} = require('electron');
const path = require('path');
const url = require('url');
const getPostData = require('./src/main/user-post');
const Loop = require('./src/main/loop');
const Throttle = require('./src/main/throttle');

if (process.env.NODE_ENV === 'development')  
    require('electron-reload')(__dirname);

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
        titleBarStyle: 'hidden',
        title: 'Tumblr Scraper',
        scrollBounce: true,
        darkTheme: true,
        scrollBounce: true,
        movable: true
    });
	
    win.loadURL(url.format({
    	pathname: path.join(__dirname, 'index.html'),
    	protocol: 'file:',
    	slashes: true
    }));

    // dereference everything
    win.on('closed', onClosed);
    let webContents = win.webContents;

    webContents.once('dom-ready', () => {
        webContents.send('asynchronous-reply', 'THROTTLE_START', loop.getThrottle());
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
            webContents.send.apply(webContents, [e].concat(Array.prototype.slice.call(arguments, 0)));
        });
    });

    /* ipc requests */
    ipcMain.on('asynchronous-message', (event, type, data) => {
        switch(type) {

            case 'START_REQUEST':
                const {blogname, types} = data;
                loop.go(types, blogname);
                event.sender.send('asynchronous-reply', 'START_RESPONSE');
                break;

            case 'CONTINUE_REQUEST':
                const didContinue = loop.continue();
                event.sender.send('asynchronous-reply', 'CONTINUE_RESPONSE', { didContinue: didContinue });
                break;

            case 'STOP_REQUEST': 
                loop.once('stopped', () => event.sender.send('asynchronous-reply', 'STOP_RESPONSE'));
                loop.stop();
                break;

            case 'OPEN_IN_BROWSER':
                shell.openExternal(data.url);
                break;
            
            case 'IMAGE_LOADED':
                Throttle.onLoad();
                break;
            
            case 'THROTTLE_TOGGLE':
                loop.toggleThrottle();
                event.sender.send('asynchronous-reply', 'THROTTLE_RESPONSE');
                break;


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
