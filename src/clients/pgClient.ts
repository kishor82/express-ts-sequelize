import * as pg from 'pg';
import { Dialect, ModelStatic, Options as SequelizeOptions, Sequelize } from 'sequelize';
import { BaseSequelizeClient, BaseSequelizeClientOptions } from './baseSequelizeClient';
import { LogLevel } from '../constants';
import { DBUserInstance, UserTable } from '../db/models';
import { parseIntOrDefault } from '../helpers';

// HACK: https://github.com/sequelize/sequelize/issues/8019
(Sequelize as any).postgres.DECIMAL.parse = (str: string) => parseFloat(str);

export type PgClientOptions = BaseSequelizeClientOptions;

export interface PgModels {
  User: ModelStatic<DBUserInstance>;
}

export class PgClient extends BaseSequelizeClient {
  public static acquire = parseIntOrDefault(process.env.PG_MAX_ACQUIRE, 10_000);

  public static idle = parseIntOrDefault(process.env.PG_POOL_IDLE, 0);

  public static maxWait = parseIntOrDefault(process.env.PG_MAX_WAIT, 900_000);

  public static poolMax = parseIntOrDefault(process.env.PG_POOL_MAX, 15);

  // - https://github.com/sequelize/sequelize/issues/9276
  public static poolMaxUses = parseIntOrDefault(process.env.PG_POOL_MAX_USES, 20);

  // Known issue with Sequelize not recycling connections. Helps close memory leaks.
  // - https://github.com/sequelize/sequelize/issues/12948
  public static poolMin = parseIntOrDefault(process.env.PG_POOL_MIN, 0);

  protected declare _models: PgModels;

  constructor(protected options: PgClientOptions) {
    super(PgClient.name, options);
  }

  public models(): PgModels {
    const logName = this.getLogBase(this.models.name);
    if (!this._models) throw new Error(`${logName} Not authenticated`);
    return this._models;
  }

  public async createInstance(): Promise<void> {
    const logName = this.getLogBase(this.createInstance.name);

    const options: SequelizeOptions = {
      dialect: 'postgres' as Dialect,
      dialectModule: pg,
      dialectOptions: {
        requestTimeout: PgClient.maxWait
      },
      pool: {
        acquire: process.env.IS_MODE_ETL === 'true' ? PgClient.maxWait : PgClient.acquire,
        idle: process.env.IS_MODE_ETL === 'true' ? PgClient.maxWait : PgClient.idle, // TODO: Instead of this `process.env.IS_MODE_ETL === 'true'` check, just support this via env for future ETLs
        max: PgClient.poolMax,
        maxUses: PgClient.poolMaxUses,
        min: PgClient.poolMin
      },
      // eslint-disable-next-line no-console
      logging: process.env.LOG_LEVEL === LogLevel.Debug || process.env.LOG_LEVEL === LogLevel.Trace ? console.log : false,
      ...(!this.options.readers?.length && { host: this.options.host, port: this.options.port }),
      ...(this.options.readers?.length && {
        replication: {
          write: {
            host: this.options.host,
            port: this.options.port
          },
          read: this.options.readers.map((reader) => ({
            host: reader.host,
            port: reader.port
          }))
        }
      })
    };

    this.log.debug(logName, { options });
    this.sequelize = new Sequelize(this.options.databaseName, this.options.username, this.options.password, options);
  }

  protected associateModels(): void {
    const models: PgModels = {
      User: UserTable(this.sequelize)
    };

    Object.values(models)
      .filter((model) => typeof (model as any).associate === 'function')
      .forEach((model) => (model as any).associate(models));

    this._models = this.sequelize.models as unknown as PgModels;
  }
}
