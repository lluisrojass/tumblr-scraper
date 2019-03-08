import { Container } from 'unstated';
import socket from '@ts/lib/Socket';
import * as connStates from './conn-states';
import {
  type StateT
} from './index.types';

class SocketContainer extends Container {
  constructor() {
    super();
    socket.on('connect', () => {
      this.setState({
        status: connStates.connected
      });
    });    
  }
  state: StateT = {
    status: connStates.startup
  }
}

export default SocketContainer;