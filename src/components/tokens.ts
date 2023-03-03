import JWT, { Algorithm } from 'jsonwebtoken';
import Logger from '@/components/logger';
import { Authentication, Nullable } from '@/types';
import getConfig from '@/components/getConfig';

const logger = new Logger('token_manager');

const {
  JWT_ACCESS_TOKEN_KEY,
  JWT_REFRESH_TOKEN_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_ALGORITHM,
} = getConfig();

if (!JWT_ACCESS_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing ACCESS_TOKEN_KEY.');
}
if (!JWT_REFRESH_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing REFRESH_TOKEN_KEY.');
}

export enum TokenType { ACCESS, REFRESH }
export enum TokenStatus { VALID, EXPIRED, INVALID, MALFORMED }
export interface ContextJWT extends JWT.JwtPayload {
  _userId?: string
}

export const generate = async (userId: string): Promise<Nullable<Authentication>> => {
  const payload = { _userId: userId };

  const auth: Authentication = { accessToken: '', refreshToken: '', userId };
  try {
    const accessToken = await JWT.sign(
      payload, 
      JWT_ACCESS_TOKEN_KEY,
      { expiresIn: JWT_ACCESS_EXPIRES_IN, algorithm: JWT_ALGORITHM as Algorithm },
    );
    auth.accessToken = accessToken!;
  } catch (error) {
    logger.error('Failed to generate access token.');
    return null;
  }

  try {
    const refreshToken = await JWT.sign(
      payload,
      JWT_REFRESH_TOKEN_KEY,
      { expiresIn: JWT_REFRESH_EXPIRES_IN, algorithm: JWT_ALGORITHM as Algorithm },
    );
    auth.refreshToken = refreshToken!;
  } catch (error) {
    logger.error('Failed to generate refresh token.');
    return null;
  }

  return auth;
};

export const decodeToken = async (token: string, type: TokenType): Promise<Nullable<string | ContextJWT>> => {
  return new Promise((resolve) => {
    return JWT.verify(
      token,
      type === TokenType.ACCESS ? JWT_ACCESS_TOKEN_KEY : JWT_REFRESH_TOKEN_KEY,
      { algorithms: [JWT_ALGORITHM as Algorithm] },
      (err, decoded) => {
        if (err) {
          return resolve(null);
        }
        return resolve(decoded);
      }
    );
  });
};

export const validateToken = async (token: string, type: TokenType): Promise<TokenStatus> => {
  if (!token) return TokenStatus.INVALID;

  return new Promise((resolve) => {
    return JWT.verify(
      token,
      type === TokenType.ACCESS ? JWT_ACCESS_TOKEN_KEY : JWT_REFRESH_TOKEN_KEY,
      { algorithms: [JWT_ALGORITHM as Algorithm] },
      (err, _decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return resolve(TokenStatus.EXPIRED);
          }
          if (err.name === 'JsonWebTokenError') {
            return resolve(TokenStatus.MALFORMED);
          }
          return resolve(TokenStatus.INVALID);
        }
        return resolve(TokenStatus.VALID);
      }
    );
  });
};

export default {
  generate,
  validateToken,
};
