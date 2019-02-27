/* @flow */
export type StateT = {
  blogname: string
};
export type SetterT = (string) => Promise<void>;
export type ResetterT = () => Promise<void>;