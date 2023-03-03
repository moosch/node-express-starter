import { NextFunction, Response } from 'express';
import Logger from '@/components/logger';
import authService from '@/services/authentication';
import {
  decodeToken,
  validateToken,
  ContextJWT,
  TokenStatus,
  TokenType,
} from '@/components/tokens';
import { Nullable, Request, SecurityContext } from '@/types';
import BaseError from '@/components/baseError';
import UserToken from '@/models/userToken';
import Cache from '@/components/cache';
import { Entity } from 'redis-om';

const logger = new Logger('context_middleware');

export const contextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Building Context for req: ${req.rquid}`);

  const { rquid, path } = req;
  logger.debug('req.path', { path: req.path, rquid });

  // Extract JWT
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (!token) {
    logger.info('Error: No Token provided', { rquid });
    return next(new NoTokenError());
  }

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

  /** @todo This and the above validation could be consolidated for improved performance. Overload response */
  const validatedToken = await decodeToken(token, TokenType.ACCESS) as Nullable<ContextJWT>;
  if (!validatedToken?._userId) {
    logger.warn('UserId not found on token');
    return next();
  }


  let cachedUserTokens, dbTokens: Nullable<UserToken>;

  // Cache attempt
  const cachedEntity = await Cache.find('token', validatedToken?._userId, token);
  if (cachedEntity) {
    cachedUserTokens = UserToken.fromDynamic(cachedEntity) as Nullable<UserToken>;
  }
  
  // Database attempt
  if (!cachedUserTokens) {
    logger.info('Cache miss on tokens');
    dbTokens = await authService.getUserToken(token);
    // Add to cache
    if (dbTokens) {
      logger.info('Adding token to cache.');
      await Cache.create('token', dbTokens);
    }
  }
  
  if (!cachedUserTokens && !dbTokens) {
    return next(new InvalidTokenError());
  }

  const userTokens = (cachedUserTokens || dbTokens)!;

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
