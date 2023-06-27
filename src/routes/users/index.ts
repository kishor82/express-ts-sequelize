import { Router, Request, Response } from 'express';
import { GenericSequelizeHandler } from '../../handlers';
import { DBTableName } from '../../constants';

const routes = Router();

routes.get('/', async (req: Request, res: Response): Promise<void> => {
  const UserHandler = new GenericSequelizeHandler(DBTableName.User);

  const response = await UserHandler.list({});

  res.status(200).json({
    msg: 'hello from get api',
    response
  });
});

export default routes;
