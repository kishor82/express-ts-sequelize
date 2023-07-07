import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { ApiResponse, ValidSection, ValidationErrors } from '../common';
import { ErrorCategory, Logging } from '../constants';
import { LoggingService } from '../services';
import { RequestValidationError } from '../helpers';

export class RequestValidator implements Logging {
  protected log: LoggingService;

  constructor(protected readonly className: string) {
    this.log = new LoggingService();
  }

  public getLogBase(functionName: string): string {
    if (!this.className) {
      throw new Error(`${RequestValidator.name}::className must be defined`);
    }

    return `${this.className}::${functionName} -> `;
  }

  private isKeyPresent = (key: string, schema: ObjectSchema): boolean => {
    const schemaKeys = schema.describe().keys;
    return key in schemaKeys;
  };

  private getRequestParameters(request: Request, schema: ObjectSchema): Record<string, any> {
    return ['body', 'params', 'query'].reduce((parameters, parameterKey) => {
      if (this.isKeyPresent(parameterKey, schema) && request[parameterKey]) {
        parameters[parameterKey] = request[parameterKey];
      }
      return parameters;
    }, {});
  }

  // Assign Default values from Joi object
  private assignDefaults(req: Request, parameters: Record<string, any>): Request {
    return Object.entries(parameters).reduce((a, [key, value]) => {
      a[key] = value;
      return a;
    }, req);
  }

  private removeSectionFromMessage(message: string): string {
    // Remove section name followed by a dot
    return message.replace(/(body|query|params)\./, '');
  }

  public validateRequest(schema: ObjectSchema) {
    const logName = this.getLogBase(this.validateRequest.name);
    return (req: Request, res: Response, next: NextFunction) => {
      this.log.start(logName, {
        path: req.baseUrl,
        method: req.method
      });
      const { error, value } = schema.validate(this.getRequestParameters(req, schema), {
        abortEarly: false
      });
      const valid = error == null;
      if (valid) {
        req = this.assignDefaults(req, value);
        this.log.success(logName, {
          path: req.baseUrl,
          method: req.method
        });
        next();
      } else {
        const { details } = error;
        const errorsBySection = {} as ValidationErrors;

        details.forEach((errorDetail) => {
          const { path, message } = errorDetail;
          const fieldPath = path.join('.');
          const section = fieldPath.split('.')[0] as ValidSection; // Extract the section (body, query, params)

          const fieldName = fieldPath.substring(section.length + 1);
          const formattedError = { field: fieldName, message: this.removeSectionFromMessage(message) };

          if (!errorsBySection[section]) {
            errorsBySection[section] = [formattedError];
          } else {
            errorsBySection[section].push(formattedError);
          }
        });
        this.log.fail(logName, error);
        next(new RequestValidationError(errorsBySection));
      }
    };
  }
}
