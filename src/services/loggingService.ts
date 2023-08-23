/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, transports, createLogger } from 'winston';
import { LogLevel } from '../constants';
import { getStage, isSandboxStage, isLocalStage } from '../helpers/env';
import DailyRotateFile from 'winston-daily-rotate-file';
import Sentry from 'winston-sentry';

process.env.LOG_LEVEL = process.env.LOG_LEVEL || LogLevel.Info;
let environmentPrinted = false;

const { combine, timestamp, prettyPrint, json } = format;

const transport: DailyRotateFile = new DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  dirname: 'logs',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

// transport.on('rotate', function (_oldFilename, newFilename) {
//   // do something fun
// });

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(timestamp(), prettyPrint(), json()),
  transports: [
    new transports.Console({ level: 'debug' }),
    transport
    // new Sentry({
    //   level: 'warn',
    //   dsn: '{{ YOUR SENTRY DSN }}', // TODO
    //   tags: { key: 'value' },
    //   extra: { key: 'value' }
    // })
  ]
});

export class LoggingService {
  constructor() {}

  public err(msg: string, err: Error, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    logger.error(msg, { properties, error: err });
  }

  public warn(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    logger.warn(msg, { properties });
  }

  info(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    logger.info(msg, { properties });
  }

  public debug(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Silent) {
      return;
    }

    logger.debug(msg, { properties });
  }

  public trace(msg: string, properties?: any) {
    if (process.env.LOG_LEVEL === LogLevel.Trace) {
      logger.log('trace', msg, { properties });
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
