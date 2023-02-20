import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger/logger';

export default function securityContext(req: Request, res: Response, next: NextFunction) {
  logger.info(`Building SC for req: ${req.rquid}`);
  next();
}
