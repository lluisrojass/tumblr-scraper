/* @flow */
export type StatusT = 0 | 1 | 2 ;
export type StateT = {
  _blogname: string,
  status: StatusT,
  errorMessage: ?string,
  isTyping: boolean
};
export type ValidatorT = (string) => Promise<void>;
export type ResetterT = () => Promise<void>;
export type TypingT = () => Promise<void>;
export type StopTypingT = () => Promise<void>;