import winston from 'winston';
import {
  formatValidationErrorsForLog,
  isValidationFieldError,
} from '@/shared/errors/validation-error';

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

function resolveLogLevel(): string {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
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
  format: isProduction
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(formatDevLogMessage),
      ),
  transports: [new winston.transports.Console()],
});
