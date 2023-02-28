import { NextFunction, Response } from 'express';
import logger from '@/components/logger';
import authService from '@/services/authentication';
import { validateToken, TokenStatus, TokenType } from '@/components/tokenManager';
import { Nullable, Request, SecurityContext } from '@/types';
import BaseError from '@/components/baseError';
import UserToken from '@/models/userToken';

export const contextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Building Context for req: ${req.rquid}`);

  const { rquid, path } = req;
  logger.debug('req.path', req.path);

  // Extract JWT
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (!token) {
    logger.info('Error: No Token provided: ');
    return next(new NoTokenError());
  }

  logger.info('Extracted token', token);

  // Ignore if trying to refresh tokens. This is handled by the controller
  if (!path.includes('/refresh')) {
    const validToken = await validateToken(token, TokenType.ACCESS);
    if (validToken === TokenStatus.INVALID) {
      logger.info('Token invalid');
      return next(new InvalidTokenError());
    }
    if (validToken === TokenStatus.EXPIRED) {
      logger.info('Token expired');
      return next(new ExpiredTokenError());
    }
  }

  let userTokens: Nullable<UserToken>;
  /** @todo Fetch from cache  */
  // On miss, get from db and add to cache

  if (!userTokens) {
    userTokens = await authService.getUserToken(token);
  }
  
  if (!userTokens) {
    return next(new InvalidTokenError());
  }

  const sc: SecurityContext = {
    _userId: userTokens.userId,
    _token: userTokens.token,
  };
  req.ctx = sc;

  return next();
};

export class NoTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'NoTokenError';
    this.message = message || '';
  }
}

export class InvalidTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidTokenError';
    this.message = message || '';
  }
}

export class ExpiredTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ExpiredTokenError';
    this.message = message || '';
  }
}

export const contextErrorHandler = async (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NoTokenError) {
    return res.status(400).json({ error: 'No Authorization token sent.' });
  }
  if (err instanceof InvalidTokenError) {
    return res.status(400).json({ error: 'Authorization token is invalid.' });
  }
  if (err instanceof ExpiredTokenError) {
    return res.status(400).json({ error: 'Authorization token is expired.' });
  }
  
  logger.debug('Unknown error in SecurityContext middleware.');
  return res.status(500).json({ error: 'Unknown error.' });
};

export default [
  contextMiddleware,
  contextErrorHandler,
];
