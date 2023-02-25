import { Request, Response,NextFunction } from 'express';
import logger from '@/components/logger';

export default function unknownRoute(req: Request, res: Response, _next: NextFunction) {
  logger.info('Unknown route.', { url: req.url });
  res.status(404);
  res.json({ message: 'Not Found.' })
}
