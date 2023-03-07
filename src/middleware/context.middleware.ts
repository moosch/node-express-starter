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

const logger = new Logger('context_middleware');

const scTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Building Context for req: ${req.rquid}`);
  const { rquid } = req;
  // Extract JWT
  const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (!accessToken) {
    logger.debug('Error: No Authorization Token provided', { rquid });
    return next(new NoTokenError());
  }

  const sc: SecurityContext = {
    _userId: '',
    _accessToken: accessToken,
  };

  req.ctx = sc;
  return next();
};

export const contextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { ctx, path } = req;
  if (path.includes('/refresh')) {
    return next();
  }
  if (!ctx) {
    return next(new NoContextError());
  }
  
  logger.info(`Validating token for req: ${req.rquid}`);

  const { _accessToken: accessToken } = ctx;

  /** @todo This and the above validation could be consolidated for improved performance. Overload the response */
  /** Could return { token?: string status: TokenStatus } */
  const validatedToken = await decodeToken(accessToken, TokenType.ACCESS) as Nullable<ContextJWT>;
  if (!validatedToken?._userId) {
    logger.warn('UserId not found on token', { accessToken, validatedToken});
    return next();
  }

  // Fetches from cache, or db on cache miss.
  const userTokens = await authService.getUserToken(validatedToken._userId, accessToken, !path.includes('/refresh'));

  if (!userTokens) {
    return next(new InvalidTokenError());
  }

  ctx._userId = userTokens.userId;
  ctx._accessToken = userTokens.accessToken;

  req.ctx = ctx;
  return next();
};

export const refreshContextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { ctx, path } = req;
  if (!path.includes('/refresh')) {
    return next();
  }
  if (!ctx) {
    return next(new NoContextError());
  }
  
  logger.info(`Validating refresh token for req: ${req.rquid}`);
  const { refreshToken } = req.body;

  const validToken = await validateToken(refreshToken, TokenType.REFRESH);
  if (validToken === TokenStatus.INVALID) {
    logger.debug('Token refresh invalid');
    return next(new InvalidRefreshTokenError());
  }
  if (validToken === TokenStatus.EXPIRED) {
    logger.debug('Refresh Token expired');
    return next(new ExpiredRefreshTokenError());
  }

  const validatedToken = await decodeToken(refreshToken, TokenType.REFRESH) as Nullable<ContextJWT>;
  if (!validatedToken?._userId) {
    logger.warn('UserId not found on token', { refreshToken, validatedToken});
    return next();
  }

  ctx._userId = validatedToken._userId;
  req.ctx = ctx;

  return next();
};

export class NoContextError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'NoContextError';
    this.message = message || '';
  }
}

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

export class InvalidRefreshTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidRefreshTokenError';
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

export class ExpiredRefreshTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'ExpiredRefreshTokenError';
    this.message = message || '';
  }
}

export const contextErrorHandler = async (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NoContextError) {
    return res.status(500).json({ error: 'Failed to build request context.' });
  }
  if (err instanceof NoTokenError) {
    return res.status(400).json({ error: 'No Authorization token sent.' });
  }
  if (err instanceof InvalidTokenError) {
    return res.status(400).json({ error: 'Authorization token is invalid.' });
  }
  if (err instanceof ExpiredTokenError) {
    return res.status(400).json({ error: 'Authorization token is expired.' });
  }
  if (err instanceof InvalidRefreshTokenError) {
    return res.status(400).json({ error: 'Invalid refresh token sent.' });
  }
  if (err instanceof ExpiredRefreshTokenError) {
    return res.status(400).json({ error: 'Refresh token has expired. Please login.' });
  }

  logger.debug('Unknown error in SecurityContext middleware.');
  return res.status(500).json({ error: 'Unknown error.' });
};

export default [
  scTokenMiddleware,        // Builds initial SecurityContext
  contextMiddleware,        // Validates Authorization bearer and adds to req.ctx
  refreshContextMiddleware, // Validates refresh token on refresh route
  contextErrorHandler,      // Handles errors
];
