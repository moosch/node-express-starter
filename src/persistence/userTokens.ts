import { QueryArrayResult } from 'pg';
import { v4 } from 'uuid';
import db from '@/components/database';
import normalizeFields from '@/components/normalizeDatabaseFields';
import UserToken from '@/models/userToken';
import logger from '@/components/logger';
import { Nullable } from '@/types';

const userTokensTableName = 'user_tokens';

export interface UserTokenByProps {
  id?: string
  userId?: string
  token?: string
}

export const findBy = async ({ id, userId, token }: UserTokenByProps): Promise<Nullable<UserToken>> => {
  let results: QueryArrayResult<any[]>;
  if (id) {
    results = await db.query(
      'find-user-token-by-id',
      `SELECT * FROM ${userTokensTableName} WHERE id = $1::uuid`,
      [id],
    );
  } else if (userId) {
    results = await db.query(
      'find-user-token-by-userid',
      `SELECT * FROM ${userTokensTableName} WHERE user_id = $1::uuid`,
      [userId],
    );
  } else if (token) {
    results = await db.query(
      'find-user-token-by-token',
      `SELECT * FROM ${userTokensTableName} WHERE token = $1::text`,
      [token],
    );
  }

  if (results!.rowCount === 0) return;
  
  const normalizedUsers = normalizeFields(results!);

  if (normalizedUsers.length === 0) return;

  return UserToken.fromDynamic(normalizedUsers[0]);
};

export const create = async (userId: string, token: string)
  : Promise<Nullable<UserToken>> => {
  const id = v4();
  await db.query(
    'create-user-token',
    `INSERT INTO ${userTokensTableName} VALUES($1::uuid, $2::uuid, $3::text)`,
    [id, userId, token],
  );

  return new UserToken({
    id,
    user_id: userId,
    token,
    created_at: Date.now(),
  });
};

// Only supports updating a token
export const update = async (userId: string, token: string): Promise<Nullable<UserToken>> => {
  if (!token) {
    logger.warn('Trying to reset password without providing salt');
    return null;
  }

  const now = Date.now();
  await db.query(
    'update-user-token',
    `UPDATE ${userTokensTableName} SET token = $1::text, updated_at = $2::bigint WHERE user_id = $3::uuid`,
    [token, now, userId],
  );
  return await findBy({ token });
};

// Only supports removing by userId and token, allowing for multiple devices
export const remove = async (userId: string, token: string): Promise<void> => {
  if (!userId || !token) {
    logger.warn('Missing userId or token in UserToken removal');
    return;
  }
  await db.query(
    'remove-user-token',
    `DELETE FROM ${userTokensTableName} WHERE user_id = $1::uuid AND token = $2::text`,
    [userId, token],
  );
};

export default {
  findBy,
  create,
  update,
  remove,
};
