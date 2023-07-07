import { NextFunction, Request, Response } from 'express';
import { DBTableName } from '../constants';
import { GenericSequelizeService } from '../services';
import { BaseController } from './baseController';
import { ApiResponse, BaseReqQuery, IdReqParams, ListResponse } from '../common';
import { CustomError, NotFoundError } from '../helpers';

export class GenericController extends BaseController {
  private readonly genericSequelizeService: GenericSequelizeService;
  constructor(protected readonly tableName: DBTableName, readonly className: string = `${GenericController.name} (${tableName})`) {
    super(className);
    this.genericSequelizeService = new GenericSequelizeService(tableName);
  }

  public async getAll<Entity, ReqQuery extends BaseReqQuery>(
    req: Request<any, any, any, ReqQuery>,
    res: Response<ApiResponse<ListResponse<Entity>>>,
    next: NextFunction
  ) {
    const logName = this.getLogBase(this.getAll.name);
    this.log.start(logName);
    const { pageNumber, pageSize, sortDirection, sortField, distinct } = req.query;
    try {
      const data = await this.genericSequelizeService.list<Entity, any>({
        ...(pageNumber && { pageNumber: +pageNumber }),
        ...(pageSize && { pageSize: +pageSize }),
        ...(sortDirection && { sortDirection: sortDirection }),
        ...(sortField && { sortField: sortField }),
        ...(distinct && { distinct: JSON.parse(distinct) })
      });
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    } finally {
      this.log.finish(logName);
    }
  }

  public async getById<Entity>(req: Request<IdReqParams>, res: Response<ApiResponse<Entity>>, next: NextFunction) {
    const logName = this.getLogBase(this.getById.name);
    this.log.start(logName);
    const { id } = req.params;
    try {
      const data = await this.genericSequelizeService.get<Entity>({ id });
      if (data) {
        res.json({ status: 'success', data });
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    } finally {
      this.log.finish(logName);
    }
  }

  public async create<ReqBody>(req: Request<any, any, ReqBody>, res: Response<ApiResponse<any>>, next: NextFunction) {
    const logName = this.getLogBase(this.create.name);
    this.log.start(logName);
    const { body } = req;
    try {
      const data = await this.genericSequelizeService.create(body);
      res.status(201).json({ status: 'success', message: 'Create successful', data });
    } catch (error) {
      next(error);
    } finally {
      this.log.finish(logName);
    }
  }

  public async update<ReqBody>(req: Request<IdReqParams, any, ReqBody>, res: Response<ApiResponse<any>>, next: NextFunction) {
    const logName = this.getLogBase(this.update.name);
    this.log.start(logName);
    const { id } = req.params;
    const { body } = req;
    try {
      const data = await this.genericSequelizeService.update({ id, ...body });
      if (data) {
        res.json({ status: 'success', message: 'Update successful', data });
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    } finally {
      this.log.finish(logName);
    }
  }

  public async delete(req: Request<IdReqParams>, res: Response<ApiResponse<any>>, next: NextFunction) {
    const logName = this.getLogBase(this.update.name);
    this.log.start(logName);
    const { id } = req.params;
    try {
      const isDeleted = await this.genericSequelizeService.destroy({ id });
      if (isDeleted) {
        res.json({ status: 'success', message: 'Delete successful', data: isDeleted });
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    } finally {
      this.log.finish(logName);
    }
  }
}
