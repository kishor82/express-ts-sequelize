import { Op } from 'sequelize';
import { ClientName, DBTableName } from '../constants';
import { BaseService, HandlerOptions } from './baseService';

export class GenericSequelizeService extends BaseService {
  private static defaultOptions: HandlerOptions = { clientNames: [ClientName.PgClient] };
  constructor(
    protected readonly tableName: DBTableName,
    readonly className: string = `${GenericSequelizeService.name} (${tableName})`,
    readonly options: HandlerOptions = GenericSequelizeService.defaultOptions
  ) {
    super(className, options);
  }

  public async get<Response>(args: { id: string }): Promise<Response> {
    const logName = this.getLogBase(this.get.name);
    this.log.start(logName, { args });

    const { id } = args;

    try {
      await this.init();
      const row = await this.clients.PgClient.models()[this.tableName].findByPk(id);
      const res = row ? row.get({ plain: true }) : null;
      this.log.success(logName, { id: res?.id || null });
      return res;
    } catch (err) {
      this.log.err(logName, err as Error);
      throw err;
    } finally {
      await this.close();
      this.log.finish(logName);
    }
  }

  public async list(filter): Promise<any> {
    const logName = this.getLogBase(this.list.name);
    this.log.start(logName);
    try {
      await this.init();
      const rows = await this.clients.PgClient.models()[this.tableName].findAll({});
      this.log.success(logName);
      return rows.map((row) => row.get({ plain: true }));
    } catch (err) {
      this.log.err(logName, err as Error);
      throw err;
    } finally {
      await this.close();
      this.log.finish(logName);
    }
  }

  public async create<CreateInput, Response>(args: CreateInput): Promise<Response> {
    const logName = this.getLogBase(this.create.name);
    this.log.start(logName, { args });

    try {
      await this.init();
      const transaction = await this.clients.PgClient.transaction();
      const row = await this.clients.PgClient.models()[this.tableName].create(args, { transaction });
      const rowData = row.get({ plain: true });
      await this.clients.PgClient.commit();
      const res = row ? rowData : null;
      this.log.success(logName);
      return res;
    } catch (err) {
      this.log.err(logName, err as Error);
      throw err;
    } finally {
      await this.close();
      this.log.finish(logName);
    }
  }

  public async update<UpdateInput extends { id: string }, RecordType>(args: UpdateInput): Promise<RecordType> {
    const logName = this.getLogBase(this.update.name);
    this.log.start(logName, { args });
    const { id } = args;
    try {
      await this.init();
      const [, row] = await this.clients.PgClient.models()[this.tableName].update(args, {
        where: {
          id
        },
        returning: true
      });
      const res = row?.length ? row[0].get({ plain: true }) : null;
      this.log.success(logName);
      return res;
    } catch (err) {
      this.log.err(logName, err as Error);
      throw err;
    } finally {
      await this.close();
      this.log.finish(logName);
    }
  }

  public async destroy(args: { id: string }): Promise<boolean> {
    const logName = this.getLogBase(this.destroy.name);
    this.log.start(logName, { args });
    const { id } = args;
    try {
      await this.init();
      const length = await this.clients.PgClient.models()[this.tableName].destroy({ where: { id: { [Op.eq]: id } } });
      this.log.success(logName);
      return !!length;
    } catch (err) {
      this.log.err(logName, err as Error);
      throw err;
    } finally {
      await this.close();
      this.log.finish(logName);
    }
  }
}
