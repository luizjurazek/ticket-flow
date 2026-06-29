import { AppError } from './app-error';
import { StructuredLogger } from '@/shared/infra/logger/logger';
import { HttpStatus } from '@/shared/utils/http-status';
import { LogContext } from '../infra/logger/log-context.interface';

interface ParsedError {
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
}

export class ErrorParser {
  public static parse(error: any): ParsedError {
    let message = 'Internal server error';
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let details: any = undefined;
    let stack = error instanceof Error ? error.stack : undefined;

    if (error instanceof AppError) {
      message = error.message;
      statusCode = error.statusCode;
      details = error.details;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    return {
      message,
      statusCode,
      details,
      stack,
    };
  }

  public static handle(error: unknown, context: LogContext): ParsedError {
    const parsed = this.parse(error);
    StructuredLogger.error(parsed.message, {
      ...context,
      statusCode: parsed.statusCode,
      errorType: error instanceof AppError ? 'AppError' : error instanceof Error ? error.name : 'Unknown',
      details: parsed.details,
      stack: parsed.stack,
    });
    return parsed;
  }
}
