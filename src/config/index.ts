import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envValidation = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('development', 'production', 'local').required(),
    STAGE: Joi.string(),
    PORT: Joi.number().default(3000),
    PG_HOST: Joi.string().default('localhost'),
    PG_USERNAME: Joi.string().required(),
    PG_PASSWORD: Joi.string().required(),
    PG_DB_NAME: Joi.string().required(),
    PG_PORT: Joi.string().default(5432),
    LOG_FOLDER: Joi.string().required(),
    LOG_FILE: Joi.string().required(),
    LOG_LEVEL: Joi.string().required()
  })
  .unknown();

const { value: envVar, error } = envValidation.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export interface AppConfig {
  nodeEnv: string;
  stage: string;
  appIdentifier?: string;
  port: number;
  pg: {
    dbHost: string;
    dbUser: string;
    dbPass: string;
    dbName: string;
    dbReaderHost: string;
  };
  logConfig: {
    logFolder: string;
    logFile: string;
    logLevel: string;
  };
}

export const config: AppConfig = {
  nodeEnv: envVar.NODE_ENV,
  stage: envVar.STAGE,
  appIdentifier: envVar.APP_IDENTIFIER,
  port: envVar.PORT,
  pg: {
    dbHost: envVar.PG_HOST,
    dbUser: envVar.PG_USERNAME,
    dbPass: envVar.PG_PASSWORD,
    dbName: envVar.PG_DB_NAME,
    dbReaderHost: envVar.PG_READER_HOST
  },
  logConfig: {
    logFolder: envVar.LOG_FOLDER,
    logFile: envVar.LOG_FILE,
    logLevel: envVar.LOG_LEVEL
  }
};
