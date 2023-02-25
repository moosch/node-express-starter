import JWT, { Algorithm } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '@/components/logger';
import { Nullable } from '@/types';

const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';
const saltRounds = 10;

if (!JWT_ACCESS_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing JWT Secret.');
}
if (!JWT_REFRESH_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing JWT Secret.');
}

export enum TokenType { ACCESS, REFRESH }
export enum TokenStatus { VALID, EXPIRED, INVALID, MALFORMED }
export interface Tokens {
  accessToken: string
  refreshToken: string
}

export const generate = async (userId: string): Promise<Nullable<Tokens>> => {
  const payload = { _userId: userId };
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

export const validateToken = async (token: string, type: TokenType): Promise<TokenStatus> => {
  if (!token) return TokenStatus.INVALID;

  return new Promise((resolve) => {
    JWT.verify(
      token,
      type == TokenType.ACCESS ? JWT_ACCESS_TOKEN_KEY : JWT_REFRESH_TOKEN_KEY,
      { algorithms: [JWT_ALGORITHM as Algorithm] },
      (err, _decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return TokenStatus.EXPIRED;
          }
          if (err.name === 'JsonWebTokenError') {
            return TokenStatus.MALFORMED;
          }
          return TokenStatus.INVALID;
        }
        return TokenStatus.VALID;
      }
    );
  });
};

export default {
  generate,
  validateToken,
};
