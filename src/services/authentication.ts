/**
 * Handles all authentication related operations.
 * Basically anything related to JWT tokens.
 */
import BaseError from '@/components/baseError';
import logger from '@/components/logger';
import tokenManager, { Tokens, TokenType } from '@/components/tokenManager';

export const generateTokens = async (userId: string, email: string): Promise<Tokens> => {
  const tokens = await tokenManager.generate(userId, email);
  if (!tokens) {
    logger.error('Failed to generate tokens.');
    throw new TokenGenerationError();
  }
  return tokens;
};

export const validatePassword = async (hashedPassword, password) => {
  /** @toto verify password with bycrypt */
};

export const refreshTokens = async (refreshToken: string, userId: string, email: string): Promise<Tokens> => {
  const validRefresh = await tokenManager.isValidToken(refreshToken, TokenType.REFRESH);

  if (!validRefresh) {
    logger.info('Invalid refresh token.');
    throw new InvalidRefreshTokenError();
  }

  // Allow to throw
  return await generateTokens(userId, email);
};

class SignupFailedError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'SignupFailedError';
    this.message = message || '';
  }
}

class TokenGenerationError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'TokenGenerationError';
    this.message = message || '';
  }
}

class InvalidRefreshTokenError extends BaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidRefreshTokenError';
    this.message = message || '';
  }
}

export {
  SignupFailedError,
  TokenGenerationError,
  InvalidRefreshTokenError,
}

export default {
  generateTokens,
  validatePassword,
  refreshTokens,
};
