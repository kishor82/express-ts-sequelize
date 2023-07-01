import { isUndefined } from 'lodash';
import { LogLevel } from '../constants';
import { getStage, isSandboxStage, isLocalStage } from '../helpers/env';

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel.Info;
let environmentPrinted = false;

export class LoggingService {
  constructor() {}

  public err(msg: string, err: Error, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    if (
      !process.env.LOG_LEVEL ||
      process.env.LOG_LEVEL === LogLevel.Error ||
      process.env.LOG_LEVEL === LogLevel.Warn ||
      process.env.LOG_LEVEL === LogLevel.Info ||
      process.env.LOG_LEVEL === LogLevel.Debug ||
      process.env.LOG_LEVEL === LogLevel.Trace
    ) {
      if (properties) {
        console.error(msg, JSON.stringify(properties));
      } else {
        console.error(msg);
      }

      console.error(err);
    }
  }

  public warn(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    if (
      !process.env.LOG_LEVEL ||
      process.env.LOG_LEVEL === LogLevel.Warn ||
      process.env.LOG_LEVEL === LogLevel.Info ||
      process.env.LOG_LEVEL === LogLevel.Debug ||
      process.env.LOG_LEVEL === LogLevel.Trace
    ) {
      if (!isUndefined(properties)) {
        console.warn(msg, JSON.stringify(properties));
      } else {
        console.warn(msg);
      }
    }
  }

  info(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    if (!process.env.LOG_LEVEL || process.env.LOG_LEVEL === LogLevel.Info || process.env.LOG_LEVEL === LogLevel.Debug || process.env.LOG_LEVEL === LogLevel.Trace) {
      if (properties) {
        console.info(msg, JSON.stringify(properties));
      } else {
        console.info(msg);
      }
    }
  }

  public debug(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    if (!process.env.LOG_LEVEL || process.env.LOG_LEVEL === LogLevel.Debug || process.env.LOG_LEVEL === LogLevel.Trace) {
      if (properties) {
        console.debug(msg, JSON.stringify(properties));
      } else {
        console.debug(msg);
      }
    }
  }

  public trace(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Trace) {
      if (properties) {
        console.trace(msg, JSON.stringify(properties));
      } else {
        console.trace(msg);
      }
    }
  }

  public start(name: string, properties?: any) {
    if (!environmentPrinted) {
      this.info(`Stage: ${getStage()} - isSandboxEnvironment: ${isSandboxStage()} - isLocalEnvironment: ${isLocalStage()}`);
      environmentPrinted = true;
    }

    this.info(`${name} started...`, properties);
  }

  public success(name: string, properties?: any) {
    this.info(`${name} successful`, properties);
  }

  public fail(name: string, err: Error) {
    this.err(`${name} errored`, err);
  }

  public finish(name: string, properties?: any) {
    this.info(`${name} finished`, properties);
  }
}
