import socket from './index';
import { Promisify } from 'utils';
const emit = Promisify(socket.emit);

export const start = async (blogname: string, types: Array<String>) => {
  if (!socket.isConnected()) return;
  return await emit('start', blogname, types);
};

export const pause = async (): Promise<boolean> => {
  if (!socket.isConnected()) return;
  return await emit('pause');
};

export const resume = async (): Promise<boolean> => {
  if (!socket.isConnected()) return;
  return await emit('resume');
};