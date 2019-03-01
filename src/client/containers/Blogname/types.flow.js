/* @flow */
import { 
  type BlognameT 
} from '@ts/lib/utils/types.flow.js';
export type StatusT = "CLEAR" | "ERROR" | "GOOD";
export type StateT = {
  blogname: string,
  status: StatusT,
  errorMessage: ?string
};
export type SetterT = (string, BlognameT) => Promise<void>;
export type ResetterT = () => Promise<void>;