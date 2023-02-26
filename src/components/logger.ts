import winston from 'winston';
import getConfig from '@/components/getConfig';

const { APP_NAME, LOG_LEVEL, NODE_ENV } = getConfig();

const transports = {
  console: new winston.transports.Console({ level: LOG_LEVEL }),
  file: new winston.transports.File({ filename: 'combined.log', level: 'error' })
};

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: APP_NAME || 'NodeJS REST API' },
  transports: [
    transports.console,
    transports.file
  ],
});

if (NODE_ENV !== 'production') {
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
