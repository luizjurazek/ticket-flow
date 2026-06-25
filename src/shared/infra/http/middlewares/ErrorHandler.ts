import { Request, Response, NextFunction } from 'express';
import { ErrorParser } from '../../../errors/ErrorParser';

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction): void {
  const parsed = ErrorParser.handle(error, `${request.method} ${request.url}`);

  const responseData: any = {
    status: 'error',
    message: parsed.message,
  };

  if (parsed.details) {
    if (Array.isArray(parsed.details) && parsed.details.length > 0 && parsed.details[0].property) {
      responseData.errors = parsed.details.reduce((acc: any, err: any) => {
        acc[err.property] = Object.values(err.constraints || {});
        return acc;
      }, {});
    } else {
      responseData.details = parsed.details;
    }
  }

  if (process.env.NODE_ENV === 'development' && parsed.stack) {
    responseData.stack = parsed.stack;
  }

  response.status(parsed.statusCode).json(responseData);
}
