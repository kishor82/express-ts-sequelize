export enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Silent = 'silent'
}

export interface Logging {
  getLogBase(fnName: string): string;
}
