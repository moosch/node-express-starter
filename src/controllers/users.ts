import { NextFunction, Response } from 'express';
import userService, { UserNotFoundError, InvalidRequestError } from '@/services/users';
import authService, { TokenGenerationError } from '@/services/authentication';
import logger from '@/components/logger';
import { Request } from '@/types';

export const find = async (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    return res.status(401).json({ error: 'Not allowed.'});
  }

  try {
    const user = await userService.findBy({ id: req.params.id });
    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ error: 'User not found.'});
    }
    return res.status(500).json({ error: 'Error finding user.'});
  }
};

export const create = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await userService.create(email, password);
    const tokens = await authService.generateTokens(user.id, email);

    return res.status(200).json({ user, tokens });
  } catch (error) {
    if (error instanceof TokenGenerationError) {
      return res.status(401).json({ error: 'Error creating tokens. Please sign in.'});
    }
    return res.status(500).json({ error: 'Error creating user.'});
  }
};

export const update = async (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.ctx!;
  const { id } = req.params;
  const { email, password } = req.body;

  if (id !== userId) {
    return res.status(401).json({ error: 'Not allowed.'});
  }
  if (!email && !password) {
    // Optionally return 400 Bad Request
    return res.status(204).json({ error: 'Nothing to do.'});
  }

  try {
    const user = await userService.update({ email, password });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating user.'});
  }
};

export const remove = async (req: Request, res: Response, _next: NextFunction) => {
  const { userId } = req.ctx!;
  const { id } = req.params;

  if (id !== userId) {
    return res.status(401).json({ error: 'Not allowed.'});
  }

  try {
    await userService.remove(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting user.' });
  }
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
  find,
  create,
  update,
  remove,
  errorHandler,
}