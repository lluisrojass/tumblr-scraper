/* @flow */
import io from 'socket.io-client';
import pipe from 'pipe-event';
import EventEmitter from 'events';
import { extractPort, extractHost } from '@ts/lib/utils/extract-args';

class Socket extends EventEmitter {
  isConnected: () => Boolean;
  connect: () => void;
  constructor(url: string, port: number) {
    super();
    const ioManagerOptions = {
      path: '/',
      reconnection: true,
      timeout: '5000',
      autoConnect: false,
      timestampRequests: true
    };
    const socket = io(url + ':' + port, ioManagerOptions);
    pipe(['connect', 'disconnect', 
      'reconnect','connect_error', 
      'connect_timeout', 'reconnect_error'], 
    socket, this);
    this.isConnected = () => !!socket.connected;
    this.connect = () => {
      socket.open();
    };
  }
}

export default new Socket(extractHost(), extractPort());