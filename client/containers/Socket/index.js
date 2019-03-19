/* @flow */
import { 
  Container 
} from 'unstated';
import socket from '@client/library/Socket';
import * as socketConnStates from './conn-status';
import {
  type StateT
} from './types';

class SocketContainer extends Container<StateT> {
  constructor() {
    super();
    socket.on('connect', () => {
      this.setState({
        status: socketConnStates.connected
      });
    });    
  }

  state = {
    status: socketConnStates.startup
  };  
}

export default SocketContainer;