import { NextFunction, Response } from 'express';
import logger from '@/components/logger';
import { Request } from '@/types';

export default function securityContext(req: Request, _res: Response, next: NextFunction) {
  logger.info(`Building SC for req: ${req.rquid}`);
  next();
}
