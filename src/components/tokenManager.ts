import JWT, { Algorithm } from 'jsonwebtoken';
import logger from '@/components/logger';
import { Nullable } from '@/types';

const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

if (!JWT_ACCESS_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing JWT Secret.');
}
if (!JWT_REFRESH_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing JWT Secret.');
}

export enum TokenType { ACCESS, REFRESH }

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export const generate = async (userId: string, email: string): Promise<Nullable<Tokens>> => {
  const payload = { userId, email };
  return new Promise((resolve) => {
    const tokens: Tokens = { accessToken: '', refreshToken: '' };

    JWT.sign(
      payload, 
      JWT_ACCESS_TOKEN_KEY,
      { expiresIn: JWT_ACCESS_EXPIRES_IN, algorithm: JWT_ALGORITHM as Algorithm },
      (error, accessToken) => {
        if (error || !accessToken) {
          logger.error('Failed to generate access token.', { error });
          resolve(null);
        }
        tokens.accessToken = accessToken!;
      },
    );

    JWT.sign(
      payload,
      JWT_REFRESH_TOKEN_KEY,
      { expiresIn: REFRESH_EXPIRES_IN, algorithm: JWT_ALGORITHM as Algorithm },
      (error, refreshToken) => {
        if (error || !refreshToken) {
          logger.error('Failed to generate refresh token.', { error });
          resolve(null);
        }
        tokens.refreshToken = refreshToken!;
      },
    );
    resolve(tokens);
  });
};

export const isValidToken = async (token: string, type: TokenType): Promise<boolean> => {
  if (!token) return false;
  
  return new Promise((resolve) => {
    JWT.verify(
      token,
      type == TokenType.ACCESS ? JWT_ACCESS_TOKEN_KEY : JWT_REFRESH_TOKEN_KEY,
      { algorithms: [JWT_ALGORITHM as Algorithm] },
      (err, _decoded) => {
        if (err) return resolve(false);
        return resolve(true);
      }
    );
  });
}

export default { generate, isValidToken };
