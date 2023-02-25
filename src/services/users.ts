import { v4 } from 'uuid';
import userPersistence, { FindUserByProps, UserUpdateProps } from '@/persistence/users';
import { Nullable, User } from '@/types';

export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<User>> => {
  const user = await userPersistence.findBy({ id, email});
  return user;
};

// findAllBy

export const create = async (email: string, password: string, salt: string): Promise<Nullable<User>> => {
  const id = v4();
  return await userPersistence.create(id, email, password, salt);
};

export const update = async (id: string, props: UserUpdateProps): Promise<Nullable<User>> => {
  return await userPersistence.upsert(id, props);
};

export const remove = async (id: string): Promise<void> => {
  return await userPersistence.remove(id);
};

export { UserUpdateProps } from '@/persistence/users';

export default {
  findBy,
  // findAllBy,
  create,
  update,
  remove,
};
