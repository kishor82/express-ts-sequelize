import { Router, Request, Response } from 'express';
import { DBTableName } from '../../constants';
import { GenericController } from '../../controllers';

const routes = Router();

const userController = new GenericController(DBTableName.User);

/**
 * NOTE:
 * Using an arrow function to maintain 'this' context when calling Controller's method
 * Alternatively, you can use the bind method: routes.get('/', userController.getAll.bind(userController));
 */

routes
  .route('/')
  .get((req, res) => userController.getAll(req, res))
  .post((req, res) => userController.create(req, res))
  .put((req, res) => userController.update(req, res));

routes
  .route('/:id')
  .get((req, res) => userController.getById(req, res))
  .delete((req, res) => userController.delete(req, res));

export default routes;
