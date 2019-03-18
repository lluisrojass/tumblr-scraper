/* @flow */
import { 
  type SocketStatusT
} from './types';
export const startup: SocketStatusT = 'STARTUP';
export const connected: SocketStatusT = 'CONNECTED';
export const disconnected: SocketStatusT = 'DISCONNECTED';
export const failure: SocketStatusT = 'FAILURE';
