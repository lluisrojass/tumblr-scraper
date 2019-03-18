declare module 'electron-log' {
  declare export default {
    warn(...any): void,
    error(...any): void,
    info(...any): void,
    silly(...any): void,
    verbose(...any): void
  }
}