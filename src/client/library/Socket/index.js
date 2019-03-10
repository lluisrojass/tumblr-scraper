/* @flow */
import * as io from 'socket.io-client';
import pipe from 'pipe-event';
import EventEmitter from 'events';
import qs from 'querystring';
import { promisify } from 'util';

class Socket extends EventEmitter {
  isConnected: () => boolean;
  connect: (url: string, port: number, nonce: string) => void;
  constructor() {
    super();
    let socket: ?io.Socket;
    const ioManagerOptions = {
      path: '/',
      reconnection: true,
      timeout: '5000',
      autoConnect: false,
      timestampRequests: true
    };

    const createSocket = (url: string, port: number, nonce: string) => {
      const query = qs.stringify({
        nonce
      });
      const socket = io(`http://${url}:${port}?${query}` , ioManagerOptions);
      socket.open();
      pipe(['connect', 'disconnect', 
        'reconnect','connect_error', 
        'connect_timeout', 'reconnect_error',
        'page', 'date', 'end', 'error'], 
      socket, this);
      pipe(['start', 'pause', 'resume'], this, socket);
      return socket;
    };

    this.connect = (url, port, nonce) => {
      socket = createSocket(url, port, nonce);
    };

    this.isConnected = () => (
      socket ? socket.connected : false
    );
    
    this.emit[promisify.custom] = (response) => {
      return new Promise((resolve) => {
        resolve(response);
      });
    };

  }
}

export default new Socket();