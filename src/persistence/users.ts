import { FieldDef, QueryArrayResult, QueryResult } from 'pg';
import db from '@/components/database';
import { Nullable, User } from '@/types';

// Converts query response to a POJO.
const normalizeFields = (result: QueryArrayResult): any[] => {
  if (result.rowCount == 0) return [];

  return result.rows.map((row) =>
    row.reduce((acc, item, i) => {
      acc[result.fields[i].name] = item;
      return acc;
    }, {} as any[]),
  );
}

export interface FindUserByProps {
  id?: string
  email?: string
}

export interface UserUpdateProps {
  email?: string
  password?: string
  salt?: string
}

// export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<FieldDef>> => {
export const findBy = async ({ id, email }: FindUserByProps): Promise<Nullable<User>> => {
  let results: QueryArrayResult<any[]>;
  if (id) {
    results = await db.query(
      'FindUserById',
      'SELECT * FROM users WHERE id = $1::text',
      [id],
    );
  }
  if (email) {
    results = await db.query(
      'FindUserByEmail',
      'SELECT * FROM users WHERE email = $1::text',
      [email],
    );
  }
  console.log(results!)
  if (results!.rowCount === 0) return;
  
  const normalizedUsers = normalizeFields(results!);
  console.log(normalizedUsers)
  if (normalizedUsers.length === 0) return;

  return {
    id: normalizedUsers[0].id,
    email: normalizedUsers[0].email,
    createdAt: normalizedUsers[0].created_at,
  } as User;
};

export const create = async (id: string, email: string, password: string, salt: string)
  : Promise<Nullable<User>> => {
  const result = await db.query(
    'CreateUser',
    'INSERT INTO users VALUES($1::uuid, $2::text, $3::text, $4::text)',
    [id, email, password, salt],
  );
  console.log('Write', result)
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