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
let nonce = extractNonce();
let ioServer;
let loop;

kickoff(port, nonce);

function kickoff(port, nonce) {
  loop = new Loop();
  ioServer = Server(port, {
    path: '/',
    serveClient: false
  });
  ioServer.use((socket, next) => {
    const {query} = socket.handshake;
    const { nonce:socketNonce } = query;
    if (socketNonce !== nonce) {
      next(new Error('Authentication Error'));
    }
    else {
      next();
    }
  });
  controller(ioServer, loop, nonce);
}

function extractPort() {
  const possiblePortArg = process.argv[process.argv.length - 2] || '';
  let [,port] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
  assert(!!port, 'server startup error, invalid argv port argument recieved');
  port = port >>> 0;
  assert(port >= 0x400 && port <= 0xFFFF, 'server startup error, '+
    'incorrectly formatted port recieved');
  return port;
}

function extractNonce() {
  const possibleNonceArg = process.argv[process.argv.length - 1] || '';
  let [,nonce] = possibleNonceArg.match(/^NONCE:(.+)$/) || [];
  assert(!!nonce, 'server startup error, invalid nonce argument recieved');
  return nonce;
}