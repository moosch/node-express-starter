import { v4 } from 'uuid';
import { NextFunction, Response } from 'express';
import Logger from '@/components/logger';
import { Request } from '@/types';

const logger = new Logger('request_logger_middleware');

function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const rquid = v4();
  req.rquid = rquid;
  logger.info(`${req.method} request`, { url: req.url, method: req.method, rquid });
  next();
}

export default requestLogger;