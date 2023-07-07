import Joi from 'joi';
import { User } from '../db/models';
import { BaseValidator } from './baseValidator';

export class UserValidator extends BaseValidator {
  constructor() {
    super(`${UserValidator.name}`);
  }

  // TODO: create seperate user schema and then use lodash pick/get to use it on update and create

  public createUserSchema = this.createSchemaValidator({
    body: this.createRequestPropertySchema<User>({
      roleId: Joi.string().uuid().required(),
      firstName: Joi.string().required(),
      userName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      companyName: Joi.string().required(),
      photo: Joi.string().allow(null),
      verficationToken: Joi.string().allow(null),
      passwordResetToken: Joi.string().allow(null)
    })
  });
}
