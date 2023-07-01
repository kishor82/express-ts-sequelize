import { Request, Response } from 'express';
import { DBTableName } from '../constants';
import { GenericSequelizeService } from '../services';
import { BaseController } from './baseController';

export class GenericController extends BaseController {
  private readonly genericSequelizeService: GenericSequelizeService;
  constructor(protected readonly tableName: DBTableName, readonly className: string = `${GenericController.name} (${tableName})`) {
    super(className);
    this.genericSequelizeService = new GenericSequelizeService(tableName);
  }

  public async getAll(req: Request, res: Response) {
    const logName = this.getLogBase(this.getAll.name);
    this.log.start(logName);
    try {
      const data = await this.genericSequelizeService.list({});
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    } finally {
      this.log.finish(logName);
    }
  }

  public async getById(req: Request, res: Response) {
    const logName = this.getLogBase(this.getById.name);
    this.log.start(logName);
    const { id } = req.params;
    try {
      const data = await this.genericSequelizeService.get({ id });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      this.log.finish(logName);
    }
  }

  public async create(req: Request, res: Response) {
    const logName = this.getLogBase(this.create.name);
    this.log.start(logName);
    const { body } = req;
    try {
      const data = await this.genericSequelizeService.create(body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      this.log.finish(logName);
    }
  }

  public async update(req: Request, res: Response) {
    const logName = this.getLogBase(this.update.name);
    this.log.start(logName);
    const { id } = req.params;
    const { body } = req;
    try {
      await this.genericSequelizeService.update({ ...body });
      res.json({ message: 'Update successful' });
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      this.log.finish(logName);
    }
  }

  public async delete(req: Request, res: Response) {
    const logName = this.getLogBase(this.update.name);
    this.log.start(logName);
    const { id } = req.params;
    try {
      await this.genericSequelizeService.destroy({ id });

      res.json({ message: 'Delete successful' });
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      this.log.finish(logName);
    }
  }
}
