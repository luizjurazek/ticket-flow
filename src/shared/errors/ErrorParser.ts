import { AppError } from './AppError';
import { Logger } from '@/shared/infra/logger/Logger';

interface ParsedError {
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
}

export class ErrorParser {
  public static parse(error: any): ParsedError {
    let message = 'Internal server error';
    let statusCode = 500;
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

  /**
   * Main utility to be used in catch blocks.
   * Logs the error and returns a formatted response object.
   */
  public static handle(error: any, context?: string): ParsedError {
    const parsed = this.parse(error);

    Logger.error(`${context ? `[${context}] ` : ''}${parsed.message}`, {
      statusCode: parsed.statusCode,
      details: parsed.details,
      stack: parsed.stack,
    });

    return parsed;
  }
}
