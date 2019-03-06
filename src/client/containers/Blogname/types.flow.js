/* @flow */
import {
  good, error, clear
} from './constants.js';
export type StatusT = good | error | clear;
export type StateT = {
  blogname: string,
  status: StatusT,
  errorMessage: ?string,
  isTyping: boolean
};
export type SetterT = (string) => Promise<void>;
export type ResetterT = () => Promise<void>;
export type TypingT = () => Promise<void>;
export type StopTypingT = () => Promise<void>;