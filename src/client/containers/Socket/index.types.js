import {
  startup,
  connected,
  disconnected,
  failure
} from './conn-states';
export type socketStates = startup | connected | disconnected | failure;
export type StateT = {
  status: socketStates
};