import { NextFunction, Request, Response } from 'express';
import { logger } from '../component/logger/logger';

export default {
  // Get logged in user
  get: async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Create new user
  create: async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Update logged in user
  update: async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Delete logged in user
  delete: async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true });
  },
  // Handle any expected user specific errors
  errorHandler: async (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.debug('errorHandler');
    next();
  },
}