import { NextFunction, Request, Response } from 'express';
import { StructuredLogger } from '@/shared/infra/logger/logger';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    StructuredLogger.http('Request completed', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
}
