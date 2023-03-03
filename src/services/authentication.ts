import encryption from '@/components/encryption';
import tokenManager, { TokenStatus, TokenType } from '@/components/tokens';
import UserToken from '@/models/userToken';
import userTokenPersistence from '@/persistence/userTokens';
import { Authentication, EncryptionPayload, Nullable } from '@/types';

export const generateTokens = async (userId: string): Promise<Nullable<Authentication>> => {
  return await tokenManager.generate(userId);
};

export const hashPassword = async (password: string): Promise<EncryptionPayload> => {
  return await encryption.encryptPassword(password);
};

export const isPasswordValid = async (hashedPassword: string, password: string): Promise<boolean> => {
  /** @toto verify password with bycrypt */
  return true;
};

export const isTokenValid = async (token: string, tokenType: TokenType): Promise<boolean> => {
  const status = await tokenManager.validateToken(token, tokenType);
  return status === TokenStatus.VALID;
}

export const refreshTokens = async (refreshToken: string, userId: string): Promise<Nullable<Authentication>> => {
  return await generateTokens(userId);
};

export const getUserToken = async (accessToken: string): Promise<Nullable<UserToken>> => {
  return await userTokenPersistence.findBy({ token: accessToken });
};

export const upsertUserToken = async (userId: string, token: string): Promise<Nullable<UserToken>> => {
  const tokens = await userTokenPersistence.findBy({ userId, token });
  if (tokens) {
    return await userTokenPersistence.update(userId, token);
  } else {
    return await userTokenPersistence.create(userId, token);
  }
}

export const removeUserToken = async (userId: string, token: string): Promise<void> => {
  return await userTokenPersistence.remove(userId, token);
}

export default {
  generateTokens,
  hashPassword,
  isPasswordValid,
  isTokenValid,
  refreshTokens,
  getUserToken,
  upsertUserToken,
  removeUserToken,
};
