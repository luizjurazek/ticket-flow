import winston from 'winston';
import { formatValidationErrorsForLog, isValidationFieldError } from '@/shared/errors/validation-error';
import { LogContext } from '@/shared/infra/logger/log-context.interface';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'white',
};

type LogLevel = keyof typeof levels;

function resolveLogLevel(): LogLevel {
  const configuredLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (configuredLevel && configuredLevel in levels) {
    return configuredLevel as LogLevel;
  }
  const nodeEnv = process.env.NODE_ENV || 'development';
  return nodeEnv === 'development' ? 'debug' : 'http';
}

function formatDevLogMessage(info: winston.Logform.TransformableInfo): string {
  let message = `${info.timestamp} ${info.level}: ${info.message}`;

  if (info.statusCode) {
    message += ` [${info.statusCode}]`;
  }

  if (info.stack) {
    message += `\n${info.stack}`;
  }

  if (info.details) {
    if (isValidationFieldError(info.details)) {
      message += `\nValidation errors:\n${formatValidationErrorsForLog(info.details)}`;
    } else {
      message += `\nDetails: ${JSON.stringify(info.details, null, 2)}`;
    }
  }

  return message;
}

winston.addColors(colors);

const isProduction = process.env.NODE_ENV === 'production';

export const Logger = winston.createLogger({
  level: resolveLogLevel(),
  levels,
  silent: process.env.NODE_ENV === 'test',
  format: isProduction
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(formatDevLogMessage),
      ),
  transports: [new winston.transports.Console()],
});

function log(level: keyof typeof levels, message: string, context?: LogContext): void {
  Logger[level](message, context ?? {});
}

export const StructuredLogger = {
  error: (message: string, context?: LogContext) => log('error', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  http: (message: string, context?: LogContext) => log('http', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};
