import { v4 } from 'uuid';
import db from '@/components/database';
import normalizeFields from '@/components/normalizeDatabaseFields';
import User from '@/models/user';
import { DBRecordTypes, Nullable } from '@/types';
import Logger from '@/components/logger';

const logger = new Logger('users_persistence');
const usersTableName = 'users';

export interface FindUserByProps {
  id?: string
  email?: string
  ignoreDeleted?: boolean
}

export interface UserUpdateProps {
  email?: string
  password?: string
}

export const findBy = async ({ id, email, ignoreDeleted = false }: FindUserByProps): Promise<Nullable<User>> => {
  const setStatements: string[] = [];
  const setVariables: DBRecordTypes[] = [];
  let setStatementCursor = 1;

  if (id) {
    setStatements.push(`id = $${setStatementCursor}::uuid`);
    setVariables.push(id);
    setStatementCursor++;
  }
  if (email) {
    setStatements.push(`email = $${setStatementCursor}::text`);
    setVariables.push(email);
    setStatementCursor++;
  }

  const statements = setStatements.join(', ');

  let query = `SELECT * FROM ${usersTableName} WHERE ${statements}`;
  if (ignoreDeleted) {
    query = ' AND deleted_at IS NULL';
  }

  const results = await db.query(
    'find-user-by',
    query,
    setVariables,
  );

  if (results!.rowCount === 0) return;
  
  const normalizedUsers = normalizeFields(results!);
  if (normalizedUsers.length === 0) return;

  return User.fromDynamic(normalizedUsers[0]);
};

export const create = async (email: string, password: string)
  : Promise<Nullable<User>> => {
  if (!email || !password) {
    logger.warn('Missing arguments in User insert from upsert');
    return null;
  }
 
  const id = v4();
  await db.query(
    'create-user',
    `INSERT INTO ${usersTableName} VALUES($1::uuid, $2::text, $3::text)`,
    [id, email, password],
  );
  return new User({
    id,
    email,
    password,
    created_at: Date.now(),
  });
};

export const update = async (id: string, { email, password }: UserUpdateProps)
  : Promise<Nullable<User>> => {
  const setStatements: string[] = [];
  const setVariables: DBRecordTypes[] = [];
  let setStatementCursor = 1;
  if (email) {
    setStatements.push(`email = $${setStatementCursor}::text`);
    setVariables.push(email);
    setStatementCursor++;
  }
  if (password) {
    setStatements.push(`password = $${setStatementCursor}::text`);
    setVariables.push(password);
    setStatementCursor++;
  }
  
  const now = Date.now();
  const timestampStatement = `$${setStatementCursor}::bigint`;
  setVariables.push(now);
  setStatementCursor++;
  
  setVariables.push(id); // id is last in SQL statement
  const idStatement = `$${setStatementCursor}::uuid`;
  setStatementCursor++;

  const statements = setStatements.join(', ');

  await db.query(
    'update-user',
    `UPDATE ${usersTableName} SET ${statements}, updated_at = ${timestampStatement} WHERE id = ${idStatement} AND deleted_at IS NULL`,
    setVariables,
  );
  return await findBy({ id });
};

export const remove = async (id: string): Promise<void> => {
  const now = Date.now();
  await db.query(
    'remove-user',
    `UPDATE ${usersTableName} SET deleted_at = $1::bigint WHERE id = $2::uuid`,
    [now, id],
  );
};

export default {
  findBy,
  create,
  update,
  remove,
};