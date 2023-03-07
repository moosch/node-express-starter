import { QueryArrayResult } from 'pg';
import { v4 } from 'uuid';
import db from '@/components/database';
import normalizeFields from '@/components/normalizeDatabaseFields';
import UserToken from '@/models/userToken';
import Logger from '@/components/logger';
import { Nullable } from '@/types';

const logger = new Logger('user_tokens_persistence');
const userTokensTableName = 'user_tokens';

export interface UserTokenByProps {
  id?: string
  userId?: string
  accessToken?: string
}

export const findBy = async ({ id, userId, accessToken }: UserTokenByProps): Promise<Nullable<UserToken>> => {
  let results: QueryArrayResult<any[]>;
  let clauses = [];
  let values = [];

  if (id) {
    clauses.push(`id = $${clauses.length+1}::uuid`);
    values.push(id);
  }
  if (userId) {
    clauses.push(`user_id = $${clauses.length+1}::uuid`);
    values.push(userId);
  }
  if (accessToken) {
    clauses.push(`access_token = $${clauses.length+1}::text`);
    values.push(accessToken);
  }

  const query = `SELECT * FROM ${userTokensTableName} WHERE ${clauses.join(` AND `)}`;
  results = await db.query(
    'find-user-token-by-userid',
    query,
    values,
  );

  if (results!.rowCount === 0) return;
  
  const normalizedUsers = normalizeFields(results!);

  if (normalizedUsers.length === 0) return;

  return UserToken.fromDynamic(normalizedUsers[0]);
};

export const create = async (userId: string, accessToken: string, refreshToken:string)
  : Promise<Nullable<UserToken>> => {
  const id = v4();
  await db.query(
    'create-user-token',
    `INSERT INTO ${userTokensTableName} VALUES($1::uuid, $2::uuid, $3::text, $4::text)`,
    [id, userId, accessToken, refreshToken],
  );

  return new UserToken({
    id,
    userId,
    accessToken,
    refreshToken,
    createdAt: Date.now(),
  });
};

// Only supports updating a token
export const update = async (userId: string, accessToken: string, refreshToken: string): Promise<Nullable<UserToken>> => {
  if (!accessToken || !refreshToken) {
    logger.warn('Missing access or refresh tokens in update.');
    return null;
  }

  const now = Date.now();
  await db.query(
    'update-user-token',
    `UPDATE ${userTokensTableName} SET access_token = $1::text, refresh_token = $2::text, updated_at = $3::bigint WHERE user_id = $4::uuid`,
    [accessToken, refreshToken, now, userId],
  );
  return await findBy({ userId, accessToken });
};

// Only supports removing by userId and token, allowing for multiple devices
export const remove = async (userId: string, accessToken: string): Promise<void> => {
  if (!userId || !accessToken) {
    logger.warn('Missing userId or accessToken in UserToken removal.');
    return;
  }
  await db.query(
    'remove-user-token',
    `DELETE FROM ${userTokensTableName} WHERE user_id = $1::uuid AND access_token = $2::text`,
    [userId, accessToken],
  );
};

export default {
  findBy,
  create,
  update,
  remove,
};
