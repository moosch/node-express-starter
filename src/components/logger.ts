import winston from 'winston';
const logLevel = process.env.LOG_LEVEL || 'error';

const transports = {
  console: new winston.transports.Console({ level: logLevel }),
  file: new winston.transports.File({ filename: 'combined.log', level: 'error' })
};

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: process.env.APP_NAME || 'NodeJS REST API' },
  transports: [
    transports.console,
    transports.file
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    // format: winston.format.simple(),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
      winston.format.colorize(),
    ),
  }));
}

export default logger;
