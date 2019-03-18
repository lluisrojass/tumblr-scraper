/* @flow */
export type OptionT = {
  label: string,
  type: string,
  value: boolean
}
export type StateT = {
  options: Array<OptionT>
}
export type OptionsToggleT = (number) => Promise<void>
