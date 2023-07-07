import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../helpers';
import { ErrorResponse, ValidatinErrorResponse } from '../common';
import { ErrorCategory } from '../constants';

// Error handler middleware
export const errorHandler = (error: Error, req: Request, res: Response<ErrorResponse | ValidatinErrorResponse>, next: NextFunction) => {
  // Handle specific types of errors

  if (error instanceof CustomError) {
    const { statusCode, message, category, error: requestError } = error;
    // Handle custom errors with specific logic
    return res.status(statusCode).json({
      status: 'error',
      message,
      category,
      error: requestError
    });
  }
  // Handle generic errors
  res.status(500).json({
    status: 'error',
    message: error.message || 'Something went wrong',
    category: ErrorCategory.INTERNAL_ERROR,
    error
  });
};
