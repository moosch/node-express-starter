import { v4 } from 'uuid';
import BaseError from '@/components/baseError';

/** @todo temporary */
interface User {
  id: string
  email: string
  password: string
}

interface FindUserByProps {
  id?: string
  email?: string
}

interface UserUpdateProps {
  email?: string
  password?: string
}

export const findBy = async ({ id, email }: FindUserByProps): Promise<User> => {
  const user = await User.getUserById(id);
  if (!user) {
    throw new UserNotFoundError(id);
  }
  return user;
};

// findAllBy

export const create = async (email: string, password: string) => {
  const userId = v4();
  const user = await User.create({userId, email, password});
  return user;
};

export const update = async ({ email, password }: UserUpdateProps) => {
  const userId = v4();
  const props: UserUpdateProps = {};
  if (email) props.email = email;
  if (password) props.password = password;

  const user = await User.upsert(userId, props);
  return user;
};

export const remove = async (userId) => {
  await User.remove(userId);
  return;
};

class InvalidRequestError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidRequestError';
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

export {
  InvalidRequestError,
  UserNotFoundError,
}

export default {
  findBy,
  // findAllBy,
  create,
  update,
  remove,
};
