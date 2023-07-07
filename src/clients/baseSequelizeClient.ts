import { Sequelize, Transaction } from 'sequelize';
import { BaseClient, BaseClientOptions } from './baseClient';
import { Maybe } from '../common';

export interface BaseSequelizeClientOptions extends BaseClientOptions {
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  readers?: Array<{ host: string; port: number }>;
  isETL?: boolean;
}
export class BaseSequelizeClient extends BaseClient {
  public sequelize: Sequelize;

  protected _models: any; // Override with correct typing

  protected txn: Maybe<Transaction>;

  constructor(protected readonly className: string, protected readonly options: BaseSequelizeClientOptions) {
    super(className, options);
  }

  public models(): any {
    const logName = this.getLogBase(this.models.name);
    throw new Error(`${logName} Must implement`);
  }

  public async connect(): Promise<void> {
    const logName = this.getLogBase(this.connect.name);
    this.log.start(logName, { databaseName: this.options.databaseName, databasePort: this.options.port });

    await this.createInstance();
    this.associateModels();
    await this.sequelize.authenticate();

    this.log.finish(logName, { databaseName: this.options.databaseName });
  }

  public async close(): Promise<void> {
    const logName = this.getLogBase(this.close.name);
    if (this.txn) {
      this.log.warn(`${logName} Rolling back uncommitted transaction...`);
      await this.rollback();
    }

    if (this.sequelize?.close) {
      await this.sequelize.connectionManager.close();
      this.log.info(`${logName} Closed database connection to ${this.options.databaseName}`);
    }
  }

  public restoreSequelizeConnection() {
    // restart connection pool to ensure connections are not re-used across invocations
    this.sequelize.connectionManager.initPools();

    this.associateModels();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (this.sequelize.connectionManager.hasOwnProperty('getConnection')) {
      delete this.sequelize.connectionManager.getConnection;
    }
  }

  public async transaction(): Promise<Transaction> {
    if (this.txn) {
      throw new Error(`${this.getLogBase(this.transaction.name)} Transaction already in progress. The previous transaction was not committed.`);
    }

    this.txn = await this.sequelize.transaction();
    return this.txn;
  }

  public async rollback(): Promise<void> {
    const logName = this.getLogBase(this.rollback.name);
    if (this.txn) {
      await this.txn.rollback();
      this.log.warn(`${logName} Transaction rolled back`);
    }
    this.txn = null;
  }

  public async commit(): Promise<void> {
    const logName = this.getLogBase(this.commit.name);

    if (!this.txn) {
      throw new Error(`${logName} No transaction to commit. Was the previous transaction already committed?`);
    }

    await this.txn.commit();
    this.log.info(`${logName} Transaction committed`);

    this.txn = null;
  }

  public async bulkUpsert<T>(
    tableName: string,
    toUpsert: T[],
    options: { ignoreDuplicates?: boolean; updateOnDuplicate?: boolean } = { updateOnDuplicate: true, ignoreDuplicates: false }
  ): Promise<T[]> {
    const model = this.models()[tableName];
    const res = await model.bulkCreate(toUpsert, {
      ...(options.updateOnDuplicate && { updateOnDuplicate: Object.keys(model.getAttributes()) }),
      ...(options.ignoreDuplicates && { ignoreDuplicates: true }),
      ...(this.txn && { transaction: this.txn })
    });

    return res.map((r) => r.get({ plain: true }));
  }

  protected async createInstance(): Promise<void> {
    const logName = this.getLogBase(this.createInstance.name);
    throw new Error(`${logName} must implement`);
  }

  protected associateModels(): void {
    const logName = this.getLogBase(this.associateModels.name);
    throw new Error(`${logName} must implement`);
  }
}
