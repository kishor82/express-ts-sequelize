import Joi, { PartialSchemaMap } from 'joi';
import { Logging } from '../constants';
import { LoggingService } from '../services';

export class BaseValidator implements Logging {
  protected log: LoggingService;

  protected constructor(protected readonly className: string) {
    this.log = new LoggingService();
  }

  public getLogBase(functionName: string): string {
    if (!this.className) {
      throw new Error(`${BaseValidator.name}::className must be defined`);
    }

    return `${this.className}::${functionName} -> `;
  }

  protected createSchemaValidator(schema: { body?: Joi.ObjectSchema; params?: Joi.ObjectSchema; query?: Joi.ObjectSchema }) {
    return Joi.object(schema);
  }

  protected createRequestPropertySchema<SchemaType>(schema: PartialSchemaMap<SchemaType>): Joi.ObjectSchema<SchemaType> {
    return Joi.object(schema);
  }
}
