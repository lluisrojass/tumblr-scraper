const { 
  BrowserWindow, 
  app, 
} = require('electron');
const { resolve } = require('path');
const { format } = require('url');
const log = require('electron-log');
const getPort = require('get-port');
require('./utils/ipc');

log.transports.file.file = __dirname + '/app.log';
log.transports.file.level = 'info';

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(resolve(__dirname, '../public/js/'));
}

const serverOnlyMode = process.env.SERVER_ONLY === '1';
let clientWindow;
let serverWindow;

function onServerClosed() {
  serverWindow = null;
  log.info('application server closed');
  if (clientWindow && !clientWindow.isDestroyed()) {
    clientWindow.destroy();
  }
}

function onClientClosed() {
  clientWindow = null;
  log.info('application client closed');
  if (serverWindow && !serverWindow.isDestroyed()) {
    serverWindow.destroy();
  }
}

function destroyAllWindows() {
  if (clientWindow && !clientWindow.isDestroyed()) {
    clientWindow.destroy();
  }
  if (serverWindow && !serverWindow.isDestroyed()) {
    serverWindow.destroy();
  }
}

function createServerWindow(port, nonce) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      additionalArguments: [
        `PORT:${port}`,
        `NONCE:${nonce}`
      ]
    }
  });

  win.loadURL(format({
    pathname: resolve(__dirname, '../src/server/_.html'),
    protocol: 'file:',
    slashes: true,
  }));
    
  win.on('closed', onServerClosed);
  win.webContents.on('crashed', destroyAllWindows);

  return win;
}

function createClientWindow(port, nonce) {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 800,
    minHeight: 500,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset',
    title: 'Tumblr Scraper',
    scrollBounce: true,
    darkTheme: true,
    movable: true,
    webPreferences: {
      additionalArguments: [
        'HOST:localhost',
        `PORT:${port}`, 
        `NONCE:${nonce}`
      ]
    }
  });

  win.loadURL(format({
    pathname: resolve(__dirname, '../index.html'),
    protocol: 'file',
    slashes: true
  }));

  if (process.env.NODE_ENV === 'development')
    win.webContents.openDevTools();

  win.webContents.on('crashed', destroyAllWindows);
  win.on('closed', onClientClosed);
    
  return win;
}

app.on('ready', async () => {
  const port = await getPort({ port: 3000 });
  const nonce = Math.random().toString(36);
  log.info(`application startup, on port ${port}`);
  serverWindow = createServerWindow(port, nonce);
  serverWindow.once('ready-to-show', () => {
    /* server successfully started up */
    if (!serverOnlyMode) {
      clientWindow = createClientWindow(port, nonce);
    }
  });
});