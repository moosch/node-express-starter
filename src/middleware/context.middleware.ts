import { NextFunction, Response } from 'express';
import logger from '@/components/logger';
import authService from '@/services/authentication';
import { validateToken, TokenStatus, TokenType } from '@/components/tokenManager';
import { Nullable, Request, SecurityContext, UserToken } from '@/types';
import BaseError from '@/components/baseError';

export const context = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Building Context for req: ${req.rquid}`);

  const { rquid } = req;
  logger.debug('req.path', req.path)

  // Extract JWT
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  if (!token) {
    logger.debug('Error: No Token provided: ');
    return next(new NoTokenError());
  }

  logger.debug('Extracted token', token);

  const validToken = await validateToken(token, TokenType.ACCESS);
  if (validToken === TokenStatus.INVALID) {
    return next(new InvalidTokenError());
  }
  if (validToken === TokenStatus.EXPIRED) {
    return next(new ExpiredTokenError());
  }

  let userTokens: Nullable<UserToken>;
  /** @todo Fetch from cache  */
  // On miss, get from db and add to cache

  if (!userTokens) {
    userTokens = await authService.getUserToken(token);
  }

  if (!userTokens) {
    return next(new NoTokenError());
  }

  const sc: SecurityContext = { _userId: userTokens.userId };
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

export default context;
