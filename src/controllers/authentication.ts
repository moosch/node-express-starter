import { NextFunction, Response } from 'express';
import authService from '@/services/authentication';
import BaseError from '@/components/baseError';
import userService from '@/services/users';
import Logger from '@/components/logger';
import { Request } from '@/types';

const logger = new Logger('authentication_controller');

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let user = await userService.findBy({ email, ignoreDeleted: true });
  if (user) {
    return next(new UserAlreadyExistsError());
  }

  const hash = await authService.hashPassword(password);

  user = await userService.create(email, hash);
  if (!user) {
    return next(new UserCreationError());
  }

  const tokens = await authService.generateTokens(user.id);
  if (!tokens) {
    return next(new TokenGenerationError());
  }

  await authService.createUserToken(user.id, tokens);

  res.status(200).json({ user: user.toJson(), tokens });
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let user = await userService.findBy({ email });
  if (!user) {
    return next(new UserNotFoundError());
  }

  const passwordValid = await authService.isPasswordValid(password, user.password);
  if (!passwordValid) {
    return next(new InvalidPasswordError());
  }

  const tokens = await authService.generateTokens(user.id);
  if (!tokens) {
    return next(new TokenGenerationError());
  }

  await authService.createUserToken(user.id, tokens);

  return res.status(200).json({ tokens });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { _userId: userId, _accessToken: accessToken } = req.ctx!;

  const tokens = await authService.generateTokens(userId);
  if (!tokens) {
    return next(new TokenGenerationError());
  }
  const newTokens = await authService.updateUserToken(userId, tokens, accessToken);
  if (!newTokens) {
    return next(new TokenRefreshError());
  }

  return res.status(200).json({ tokens });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { _userId: userId, _accessToken: accessToken } = req.ctx!;

  await authService.removeUserToken(userId, accessToken);

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

class TokenRefreshError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'TokenRefreshError';
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
  if (err instanceof TokenRefreshError) {
    return res.status(500).json({ error: 'Failed to refresh tokens.' });
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
