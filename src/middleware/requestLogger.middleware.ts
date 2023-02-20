import { v4 } from 'uuid';
import { NextFunction, Response } from 'express';
import logger from '@/components/logger';
import { Request } from '@/types';

function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const rquid = v4();
  req.rquid = rquid;
  logger.info(`${req.method} request`, { url: req.url, method: req.method, rquid });
  next();
}

export default requestLogger;