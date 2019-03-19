import type {
  EventEmitter
} from 'events';
declare module 'pipe-event' {
  declare export default (Array<string>, EventEmitter, EventEmitter) => void
}