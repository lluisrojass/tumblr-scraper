/* @flow */
import { type BlognameT } from '@ts/lib/utils/types.flow.js';
export type OptionT = {
  label: string,
  type: BlognameT,
  value: boolean
}
export type StateT = {
  options: Array<OptionT>,
}
export type SetterT = (number) => Promise<void>