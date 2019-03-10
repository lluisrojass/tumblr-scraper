const { ipcMain, shell } = require('electron');
const log = require('electron-log');

ipcMain.on('open-url', (event, url) => {
  if (!url || typeof url !== 'string') {
    log.warn(`open-in-browser event recieved with invalid url ${url}`);
  }
  shell.openExternal(url);
});