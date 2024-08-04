import winston from 'winston';

export function configureLogger() {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: process.env.LOG_FILE_PATH }),
    ],
  });
}
