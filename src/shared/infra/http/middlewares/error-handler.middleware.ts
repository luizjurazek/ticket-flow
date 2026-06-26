import { Request, Response, NextFunction } from 'express';
import { ErrorParser } from '@/shared/errors/error-parser';
import { isValidationFieldError, toApiFieldErrors } from '@/shared/errors/validation-error';

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction): void {
  const parsed = ErrorParser.handle(error, {
    requestId: request.requestId,
    method: request.method,
    path: request.originalUrl,
  });

  const responseData: Record<string, unknown> = {
    status: 'error',
    message: parsed.message,
  };

  if (parsed.details) {
    if (isValidationFieldError(parsed.details)) {
      responseData.errors = toApiFieldErrors(parsed.details);
    } else {
      responseData.details = parsed.details;
    }
  }

  if (process.env.NODE_ENV === 'development' && parsed.stack) {
    responseData.stack = parsed.stack;
  }

  response.status(parsed.statusCode).json(responseData);
}
