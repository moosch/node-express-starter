import db from '@/components/database';
import { Nullable, User } from '@/types';

export interface FindUserByProps {
  id?: string
  email?: string
}

export interface UserUpdateProps {
  email?: string
  password?: string
  salt?: string
}

export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<User>> => {
  return;
};

export const create = async (id: string, email: string, password: string, salt: string)
  : Promise<Nullable<User>> => {
  return {
    id,
    email,
    createdAt: Date.now(),
  } as User;
};

export const upsert = async (id: string, { email, password, salt }: UserUpdateProps): Promise<Nullable<User>> => {
  return;
};

export const remove = async (id: string): Promise<void> => {
  return;
};

export default {
  findBy,
  create,
  upsert,
  remove,
};