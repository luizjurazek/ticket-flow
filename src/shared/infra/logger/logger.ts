import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${info.details ? ' ' + JSON.stringify(info.details) : ''}`,
  ),
);

const transports = [new winston.transports.Console()];

export const Logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston.format.json()),
  transports,
});

if (process.env.NODE_ENV !== 'production') {
  Logger.format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
      let msg = `${info.timestamp} ${info.level}: ${info.message}`;

      if (info.stack) {
        msg += `\n${info.stack}`;
      }

      if (info.details) {
        if (Array.isArray(info.details) && info.details.length > 0 && info.details[0].property) {
          msg += '\nValidation Details:';
          info.details.forEach((err: any) => {
            const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Unknown error';
            msg += `\n   - [${err.property}]: ${constraints}`;
          });
        } else {
          msg += `\nDetails: ${JSON.stringify(info.details, null, 2)}`;
        }
      }

      return msg;
    }),
  );
}
