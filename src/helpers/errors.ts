import { Maybe, ValidationErrors } from '../common';
import { ErrorCategory } from '../constants';

// Custom error class
export class CustomError extends Error {
  statusCode: number;
  category: ErrorCategory;
  error: Maybe<ValidationErrors>;

  constructor(message: string, statusCode: number, category: ErrorCategory, error: ValidationErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.category = category;
    this.error = error;
  }
}

export class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400, ErrorCategory.BAD_REQUEST_ERROR);
  }
}

export class InternalServerError extends CustomError {
  constructor() {
    super('Internal server error', 500, ErrorCategory.INTERNAL_ERROR);
  }
}

export class RequestValidationError extends CustomError {
  constructor(error: ValidationErrors) {
    super('Invalid request parameters', 400, ErrorCategory.VALIDATION_ERROR, error);
  }
}

export class UnauthorizationError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, ErrorCategory.AUTHENTICATION_ERROR);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, ErrorCategory.PERMISSION_ERROR);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, ErrorCategory.NOT_FOUND_ERROR);
  }
}
