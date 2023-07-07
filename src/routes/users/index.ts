import { Router } from 'express';
import { DBTableName } from '../../constants';
import { GenericController } from '../../controllers';
import { RequestValidator } from '../../middleware';
import { UserValidator } from '../../validators';

const routes = Router();

const userController = new GenericController(DBTableName.User);
const requestValidator = new RequestValidator(DBTableName.User);
const { createUserSchema } = new UserValidator();

/**
 * NOTE:
 *  - Using an arrow function to maintain 'this' context when calling Controller's method
 *    Alternatively, you can use the bind method: routes.get('/', userController.getAll.bind(userController));
 *  - It is not recommended to destructure the validator method and call it separately, as it can potentially lose the correct context of the class and cause issues.
 */

routes
  .route('/')
  .get((req, res, next) => userController.getAll(req, res, next))
  .post([requestValidator.validateRequest(createUserSchema)], (req, res, next) => userController.create(req, res, next));

routes
  .route('/:id')
  .get((req, res, next) => userController.getById(req, res, next))
  .put((req, res, next) => userController.update(req, res, next))
  .delete((req, res, next) => userController.delete(req, res, next));

export default routes;
