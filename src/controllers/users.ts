import { NextFunction, Response } from 'express';
import Logger from '@/components/logger';
import userService, { UserUpdateProps } from '@/services/users';
import authService from '@/services/authentication';
import BaseError from '@/components/baseError';
import { Request } from '@/types';

const logger = new Logger('users_controller');

export const find = async (req: Request, res: Response, next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    return next(new UnauthorizedError());
  }

  const user = await userService.findBy({ id });
  if (!user) {
    return next(new UserNotFoundError());
  }

  return res.status(200).json({ user });
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;
  let { email, password } = req.body;
  const props: UserUpdateProps = { email };

  if (id !== userId) {
    return next(new UnauthorizedError());
  }
  if (!email && !password) {
    // Optionally: next(new InvalidParamsError());
    return res.status(200).send({ message: 'Nothing to do.'});
  }

  /** @todo should probably verify the existing password */
  if (password) {
    const { hash, salt } = await authService.hashPassword(password);
    props.password = hash;
    props.salt = salt;
  }

  let user = await userService.findBy({ id });
  if (!user) {
    return next(new UserNotFoundError());
  }
  
  user = await userService.update(id, props);
  if (!user) {
    return next(new UpdateUserError());
  }

  return res.status(200).json({ user });
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { _userId: userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    return next(new UnauthorizedError());
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

class UpdateUserError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'UpdateUserError';
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
  if (err instanceof UpdateUserError) {
    return res.status(500).json({ error: 'Failed to update user.' });
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