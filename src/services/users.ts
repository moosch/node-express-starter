import userPersistence, { FindUserByProps, UserUpdateProps } from '@/persistence/users';
import User from '@/models/user';
import { Nullable } from '@/types';

export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<User>> => {
  return await userPersistence.findBy({ id, email});
};

// findAllBy

export const create = async (email: string, password: string, salt: string): Promise<Nullable<User>> => {
  return await userPersistence.create(email, password, salt);
};

export const update = async (id: string, props: UserUpdateProps): Promise<Nullable<User>> => {
  return await userPersistence.update(id, props);
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
