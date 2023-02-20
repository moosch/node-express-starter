import logger from '@/components/logger';
import { Request, Response,NextFunction } from 'express';

export default function unknownRoute(req: Request, res: Response, _next: NextFunction) {
  logger.info('Unknown route', { url: req.url });
  res.status(404);
  res.json({ message: 'Not Found' })
}
