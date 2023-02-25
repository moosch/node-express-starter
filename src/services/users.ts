import { v4 } from 'uuid';
import { Nullable, User } from '@/types';

interface FindUserByProps {
  id?: string
  email?: string
}

interface UserUpdateProps {
  email?: string
  password?: string
}

export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<User>> => {
  const user = await Database.getUserById({ id, email});
  return user;
};

// findAllBy

export const create = async (email: string, password: string): Promise<Nullable<User>> => {
  const userId = v4();
  return await Database.create({userId, email, password});
};

export const update = async ({ email, password }: UserUpdateProps): Promise<User> => {
  const userId = v4();
  const props: UserUpdateProps = {};
  if (email) props.email = email;
  if (password) props.password = password;

  return await Database.upsert(userId, props);
};

export const remove = async (id): Promise<void> => {
  return await Database.remove(id);
};

export default {
  findBy,
  // findAllBy,
  create,
  update,
  remove,
};
