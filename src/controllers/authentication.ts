import { NextFunction, Response } from 'express';
import authService, { InvalidRefreshTokenError, TokenGenerationError } from '@/services/authentication';
import cacheService from '@/services/cache';
import tokenService from '@/services/tokens';
import userService from '@/services/users';
import logger from '@/components/logger';
import { Nullable, Request } from '@/types';

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface User {
  id: string
  email: string
  password: string
  createdAt: number
  updatedAt?: number
  deletedAt?: number
}

export const signup = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  let user: User;
  let tokens: Tokens;

  try {
    let user: Nullable<User> = await userService.findBy({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    user = await userService.create(email, password);

    const tokens = await authService.generateTokens(user.id, email);

    /** @todo Save tokens to db */
    await tokenService

    res.status(200).json({ tokens });
  } catch (error) {
    if (error instanceof TokenGenerationError) {
      return res.status(400).json({ error: 'Failed to generate tokens, but user was created.' });
    }
    
    return res.status(400).json({ error: 'Failed to create user.' });
  }
};

export const signin = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  let user: User;
  let tokens: Tokens;

  try {
    user = await userService.getBy({ email });
  } catch (err) {
    return res.status(400).json({ error: 'Failed email check.' });
  }

  try {
    await authService.validatePassword(user.password, password);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to generate tokens.' });
  }

  try {
    tokens = await authService.generateTokens(user.id, email);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to generate tokens.' });
  }

  res.status(200).json({ tokens });
};

export const refresh = async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken } = req.body;
  const { userId, email } = req.ctx!;

  try {
    const tokens = await authService.refreshTokens(refreshToken, userId, email);
    
    /** @todo Save tokens to db */
    
    res.status(200).json({ tokens });
  } catch (error) {
    if (error instanceof InvalidRefreshTokenError) {
      return res.status(400).json({ error: 'Invalid refresh token.' });
    }
    return res.status(500).json({ error: 'Token refresh error.' });
  }
};

export const logout = async (req: Request, res: Response, _next: NextFunction) => {
  const { userId, accessToken } = req.ctx!;

  /** @todo Remove tokens from db by userId */
  try {
    await cacheService.removeById(userId);
  } catch (err) {
    logger.error('Failed to remove tokens from cache');
    return res.status(402).json({ error: 'Failed to remove tokens.' });
  }
  
  /** @todo Remove tokens from Redis */
  try {
    await tokenService.remove(userId);
  } catch (err) {
    logger.error('Failed to logout');
    return res.status(402).json({ error: 'Failed to logout.' });
  }

  res.status(201).send();
};

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error in user route', {
    rquid: req.rquid,
    error: err,
    url: req.url,
    params: req.params,
    body: req.body,
    query: req.query,
  });

  return res.status(500).json({ error: 'Unknown error.' });
};

export default {
  signup,
  signin,
  refresh,
  logout,
  errorHandler,
}
