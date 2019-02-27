const assert = require('assert');
const Server = require('socket.io');
const controller = require('./modules/controller');
const Loop = require('./modules/loop');
const log = require('electron-log');

process.on('uncaughtException', error => {
  log.error(error);
  process.exit(1);
});

let port = extractPort();
let ioServer;
let loop;

kickoff(port);

function kickoff(port) {
  loop = new Loop();
  ioServer = new Server();
  ioServer.listen(port);
  controller(ioServer, loop);
}

function extractPort() {
  const possiblePortArg = process.argv[process.argv.length - 1] || '';
  let [,port] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
  assert(!!port, 'server startup error, invalid argv port argument recieved');
  port = port >>> 0;
  assert(port >= 0x400 && port <= 0xFFFF, 'server startup error, '+
    'incorrectly formatted port recieved');
  return port;
}