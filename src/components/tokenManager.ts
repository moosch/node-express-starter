import JWT, { Algorithm } from 'jsonwebtoken';
import logger from '@/components/logger';
import { Nullable } from '@/types';

const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_KEY;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '30m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

if (!JWT_ACCESS_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing ACCESS_TOKEN_KEY.');
}
if (!JWT_REFRESH_TOKEN_KEY) {
  throw new Error('Unable to start server. Missing REFRESH_TOKEN_KEY.');
}

export enum TokenType { ACCESS, REFRESH }
export enum TokenStatus { VALID, EXPIRED, INVALID, MALFORMED }
export interface Tokens {
  accessToken: string
  refreshToken: string
}

export const generate = async (userId: string): Promise<Nullable<Tokens>> => {
  const payload = { _userId: userId };
  console.log(`Generating for ${userId}`)

  const tokens: Tokens = { accessToken: '', refreshToken: '' };
  try {
    const accessToken = await JWT.sign(
      payload, 
      JWT_ACCESS_TOKEN_KEY,
      { expiresIn: JWT_ACCESS_EXPIRES_IN, algorithm: JWT_ALGORITHM as Algorithm },
    );
    tokens.accessToken = accessToken!;
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
    tokens.refreshToken = refreshToken!;
  } catch (error) {
    logger.error('Failed to generate refresh token.');
    return null;
  }

  return tokens;
};

export const validateToken = async (token: string, type: TokenType): Promise<TokenStatus> => {
  if (!token) return TokenStatus.INVALID;

  return new Promise((resolve) => {
    return JWT.verify(
      token,
      type == TokenType.ACCESS ? JWT_ACCESS_TOKEN_KEY : JWT_REFRESH_TOKEN_KEY,
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
