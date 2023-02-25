import tokenManager, { Tokens, TokenStatus, TokenType } from '@/components/tokenManager';
import userTokenPersistence, { UserToken } from '@/persistence/userTokens';
import { Nullable } from '@/types';

export const generateTokens = async (userId: string): Promise<Nullable<Tokens>> => {
  return await tokenManager.generate(userId);
};

export const isPasswordValid = async (hashedPassword: string, password: string): Promise<boolean> => {
  /** @toto verify password with bycrypt */
  return true;
};

export const isTokenValid = async (token: string, tokenType: TokenType): Promise<boolean> => {
  const status = await tokenManager.validateToken(token, tokenType);
  return status !== TokenStatus.VALID;
}

export const refreshTokens = async (refreshToken: string, userId: string): Promise<Nullable<Tokens>> => {
  return await generateTokens(userId);
};

export const getUserToken = async (accessToken: string): Promise<UserToken> => {
  return await userTokenPersistence.getByToken(accessToken);
};

export const upsertUserToken = async (userId: string, token: string): Promise<UserToken> => {
  return await userTokenPersistence.upsertToken(userId, token);
}

export const removeUserToken = async (userId: string): Promise<void> => {
  return await userTokenPersistence.removeToken(userId);
}

export default {
  generateTokens,
  isPasswordValid,
  isTokenValid,
  refreshTokens,
  getUserToken,
  upsertUserToken,
  removeUserToken,
};
