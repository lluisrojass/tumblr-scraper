/* @flow */
import * as io from 'socket.io-client';
import pipe from 'pipe-event';
import EventEmitter from 'events';
import qs from 'querystring';

class Socket extends EventEmitter {
  isConnected: () => Boolean;
  connect: (url: string, port: number, nonce: string) => void;
  socket: ?io.Manager;
  constructor() {
    super();
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
        'connect_timeout', 'reconnect_error'], 
      socket, this);
      return socket;
    };

    this.connect = (url, port, nonce) => {
      this.socket = createSocket(url, port, nonce);
    };
  }

  isConnected = () => (
    this.socket ? this.socket.connected : false
  );
}

export default new Socket();