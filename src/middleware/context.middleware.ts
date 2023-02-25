import { NextFunction, Response } from 'express';
import logger from '@/components/logger';
import { validateJWT } from '@/components/tokenManager';
import { Request } from '@/types';

export default function securityContext(req: Request, res: Response, next: NextFunction) {
  logger.info(`Building SC for req: ${req.rquid}`);

  const { rquid } = req;
  console.log('req.path', req.path)

  // Extract JWT
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (!token) {
    res.status(401).json({
      message: 'Error: No Token provided',
    });
    console.error('Error: No Token provided: ');
    next(Error('No Token provided'));
    return;
  }

  // validToken will contain email
  const validToken = validateJWT(token)

  // Verify

  /** @todo Fetch from Redis  */

  // On a cache miss, get from database and store in cache.

  // if (req.path sessionID)
  // if (!session?.userid){
  //   res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  // } else {
  //   next();
  // }
  next();
}
