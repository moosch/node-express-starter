import winston from 'winston';
import uuid from 'uuid';
import { NextFunction, Response } from 'express';
import { Request } from 'src/types';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.APP_NAME || 'Node app' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    // format: winston.format.simple(),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
      winston.format.colorize(),
    ),
  }));
// }


function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const rquid = uuid.v4();
  req.rquid = rquid;
  logger.info(`${req.method} request`, { url: req.url, method: req.method, rquid });
  next();
}

export default requestLogger;
