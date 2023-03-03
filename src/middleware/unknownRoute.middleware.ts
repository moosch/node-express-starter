import { Request, Response,NextFunction } from 'express';
import Logger from '@/components/logger';

const logger = new Logger('unknown_route_middleware');

export default function unknownRoute(req: Request, res: Response, _next: NextFunction) {
  logger.info('Unknown route.', { url: req.url });
  res.status(404);
  res.json({ message: 'Not Found.' })
}
