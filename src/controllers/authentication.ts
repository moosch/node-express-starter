import { NextFunction, Response } from 'express';
import authService from '@/services/authentication';
import BaseError from '@/components/baseError';
import userService from '@/services/users';
import logger from '@/components/logger';
import { Request } from '@/types';
import { TokenType } from '@/components/tokenManager';

export const signup = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  let user = await userService.findBy({ email });
  if (user) {
    throw new UserAlreadyExistsError();
  }
  
  user = await userService.create(email, password);
  if (!user) {
    throw new UserCreationError();
  }

  const tokens = await authService.generateTokens(user.id, email);
  if (!tokens) {
    throw new TokenGenerationError();
  }

  await authService.upsertUserTokens(user.id, tokens);

  res.status(200).json({ user, tokens });
};

export const signin = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  let user = await userService.findBy({ email });
  if (!user) {
    throw new UserNotFoundError();
  }

  const passwordValid = await authService.isPasswordValid(user.password, password);
  if (!passwordValid) {
    throw new InvalidPasswordError();
  }

  const tokens = await authService.generateTokens(user.id, email);
  if (!tokens) {
    throw new TokenGenerationError();
  }

  await authService.upsertUserTokens(user.id, tokens);

  return res.status(200).json({ tokens });
};

export const refresh = async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken } = req.body;
  const { userId, email } = req.ctx!;

  const isTokenValid = await authService.isTokenValid(refreshToken, TokenType.REFRESH);
  if (!isTokenValid) {
    throw new InvalidRefreshTokenError();
  }

  const tokens = await authService.refreshTokens(refreshToken, userId, email);
  if (!tokens) {
    throw new TokenGenerationError();
  }

  await authService.upsertUserTokens(userId, tokens);

  return res.status(200).json({ tokens });
};

export const logout = async (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.ctx!;

  authService.removeUserToken(userId);

  return res.status(201).send();
};

class UserCreationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserCreationError';
    this.message = message || '';
  }
}

class UserAlreadyExistsError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
    this.message = message || '';
  }
}

class UserNotFoundError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'UserNotFoundError';
    this.message = message || '';
  }
}

class InvalidPasswordError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidPasswordError';
    this.message = message || '';
  }
}

class TokenGenerationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'TokenGenerationError';
    this.message = message || '';
  }
}

class InvalidRefreshTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidRefreshTokenError';
    this.message = message || '';
  }
}

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.debug('Error in auth route', {
    rquid: req.rquid,
    error: err,
    url: req.url,
    params: req.params,
    body: req.body,
    query: req.query,
  });

  if (err instanceof UserCreationError) {
    return res.status(500).json({ error: 'Failed to create user.' });
  }
  if (err instanceof UserAlreadyExistsError) {
    return res.status(400).json({ error: 'Email already registered.' });
  }
  if (err instanceof UserNotFoundError) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (err instanceof InvalidPasswordError) {
    return res.status(404).json({ error: 'Invalid loginsUser.' });
  }
  if (err instanceof TokenGenerationError) {
    return res.status(500).json({ error: 'Failed to generate tokens.' });
  }
  if (err instanceof InvalidRefreshTokenError) {
    return res.status(404).json({ error: 'Invalid token.' });
  }

  return res.status(500).json({ error: 'Unknown error.' });
};

export default {
  signup,
  signin,
  refresh,
  logout,
  errorHandler,
}
