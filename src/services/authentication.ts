import tokenManager, { Tokens, TokenType } from '@/components/tokenManager';
import { Nullable } from '@/types';

export const generateTokens = async (userId: string, email: string): Promise<Nullable<Tokens>> => {
  return await tokenManager.generate(userId, email);
};

export const isPasswordValid = async (hashedPassword: string, password: string): Promise<boolean> => {
  /** @toto verify password with bycrypt */
  return true;
};

export const isTokenValid = async (token: string, tokenType: TokenType): Promise<boolean> => {
  return await tokenManager.isTokenValid(token, tokenType);
}

export const refreshTokens = async (refreshToken: string, userId: string, email: string): Promise<Nullable<Tokens>> => {
  return await generateTokens(userId, email);
};

export const upsertUserTokens = async (userId: string, tokens: Tokens): Promise<void> => {
  return await Database.upsertUserTokens(userId, tokens.accessToken, tokens.refreshToken);
}

export const removeUserToken = async (userId: string): Promise<void> => {
  return await Database.removeUserTokens(userId);
}

export default {
  generateTokens,
  isPasswordValid,
  isTokenValid,
  refreshTokens,
  upsertUserTokens,
  removeUserToken,
};
