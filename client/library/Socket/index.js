/* @flow */
import io from 'socket.io-client';
import pipe from 'pipe-event';
import EventEmitter from 'events';
import qs from 'querystring';
import type {
  SocketI
} from './types';

class Socket extends EventEmitter implements SocketI  {
  __socket;
  __opts = {
    path: '/',
    reconnection: true,
    timeout: 5000,
    autoConnect: false,
  }

  isConnected = () => !!this.__socket && this.__socket.connected;

  connect = (url, port, nonce) => {
    if (!this.isConnected()) {
      const query = qs.stringify({ nonce });
      this.__socket = io(`http://${url}:${port}?${query}` , this.__opts);
      this.__socket.open();
      pipe([
        'connect', 
        'disconnect', 
        'reconnect',
        'connect_error', 
        'connect_timeout',
        'reconnect_error',
        'page', 
        'date',
        'end',
        'error'
      ], this.__socket, this);
       pipe([
          'start', 
          'pause', 
          'resume'
        ], this, this.__socket);
    }
  }

  start = (blogName, types) => {
    return new Promise((res, rej) => {
      if (!this.__socket || !this.isConnected()) {
        return rej(new Error('Cannot preform operation on closed socket'));
      }
      this.__socket.emit('start', blogName, types, res);
    });
  };

  pause = () => {
    return new Promise((res, rej) => {
      if (!this.__socket || !this.isConnected()) {
        return rej(new Error('Cannot preform operation on closed socket'));
      }

      this.__socket.emit('paused', res);
    });
  };

  resume = () => {
    return new Promise((res, rej) => {
      if (!this.__socket || !this.isConnected()) {
        return rej(new Error('Cannot preform operation on closed socket'));
      }

      this.__socket.emit('resume', res);
    });
  }
}

export default new Socket();