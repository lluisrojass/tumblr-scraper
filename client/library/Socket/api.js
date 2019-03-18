/* @flow */
import socket from './index';
import { promisify } from 'util';
const emit = promisify(socket.emit);

export const start = async (blogname: string, types: Array<String>) => {
  if (!socket.isConnected()) return;
  return await emit('start', blogname, types);
};

export const pause = async (): Promise<boolean | void> => {
  if (!socket.isConnected()) return;
  return await emit('pause');
};

export const resume = async (): Promise<boolean | void> => {
  if (!socket.isConnected()) return;
  return await emit('resume');
};