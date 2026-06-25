import { Request, Response, NextFunction } from 'express';
import { ErrorParser } from '../../../errors/ErrorParser';

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const parsed = ErrorParser.handle(error, `${request.method} ${request.url}`);

  response.status(parsed.statusCode).json({
    status: 'error',
    message: parsed.message,
    ...(parsed.details ? { details: parsed.details } : {}),
    ...(process.env.NODE_ENV !== 'production' ? { stack: parsed.stack } : {}),
  });
}
