import { NextFunction, Request, Response } from 'express';
import logger from '@/components/logger';

export default {
  // Get logged in user
  get: async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Create new user
  create: async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Update logged in user
  update: async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Delete logged in user
  delete: async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Handle any expected user specific errors
  errorHandler: async (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.debug('errorHandler');
    next();
  },
}
