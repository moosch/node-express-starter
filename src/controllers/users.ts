import { NextFunction, Response } from 'express';
import userService from '@/services/users';
import logger from '@/components/logger';
import { Request } from '@/types';
import BaseError from '@/components/baseError';

export const find = async (req: Request, res: Response, _next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    throw new UnauthorizedError();
  }

  const user = await userService.findBy({ id: req.params.id });
  if (!user) {
    throw new UserNotFoundError();
  }

  return res.status(200).json({ user });
};

export const update = async (req: Request, res: Response, _next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;
  const { email, password } = req.body;

  if (id !== userId) {
    throw new UnauthorizedError();
  }
  if (!email && !password) {
    // Optionally: throw new InvalidParamsError();
    return res.status(204).json({ error: 'Nothing to do.'});
  }

  let user = await userService.findBy({ id });
  if (!user) {
    throw new UserNotFoundError();
  }

  user = await userService.update({ email, password });

  return res.status(200).json({ user });
};

export const remove = async (req: Request, res: Response, _next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    throw new UnauthorizedError();
  }
  
  await userService.remove(id);
  return res.status(200).json({ success: true });
};

class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
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

class TokenGenerationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'TokenGenerationError';
    this.message = message || '';
  }
}

class InvalidParamsError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidParamsError';
    this.message = message || '';
  }
}

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.debug('Error in user route', {
    rquid: req.rquid,
    error: err,
    url: req.url,
    params: req.params,
    body: req.body,
    query: req.query,
  });

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: 'Not allowed.'});
  }
  if (err instanceof UserNotFoundError) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (err instanceof TokenGenerationError) {
    return res.status(500).json({ error: 'Failed to generate tokens.' });
  }
  if (err instanceof InvalidParamsError) {
    return res.status(400).json({ error: 'Invalid params.' });
  }

  return res.status(500).json({ error: 'Unknown error.' });
};

export default {
  find,
  update,
  remove,
  errorHandler,
}