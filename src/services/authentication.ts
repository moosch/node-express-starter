import encryption from '@/components/encryption';
import tokenManager, { TokenStatus, TokenType } from '@/components/tokens';
import UserToken from '@/models/userToken';
import cacheService from '@/services/cache';
import userTokenPersistence from '@/persistence/userTokens';
import { Authentication, Nullable } from '@/types';
import Logger from '@/components/logger';

const logger = new Logger('authentication_service');

export const generateTokens = async (userId: string): Promise<Nullable<Authentication>> => {
  return await tokenManager.generate(userId);
};

export const hashPassword = async (password: string): Promise<string> => {
  return await encryption.encryptPassword(password);
};

export const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await encryption.isPasswordValid(password, hashedPassword);
};

export const isTokenValid = async (token: string, tokenType: TokenType): Promise<boolean> => {
  const status = await tokenManager.validateToken(token, tokenType);
  return status === TokenStatus.VALID;
}

export const getUserToken = async (userId: string, accessToken: string, saveToCache = true): Promise<Nullable<UserToken>> => {
  // Attempt cache
  let tokens: Nullable<UserToken>;

  const cachedTokens = await cacheService.find('token', userId!, accessToken);

  if (cachedTokens) {
    return UserToken.fromDynamic(cachedTokens);
  }

  logger.debug('Cache miss on tokens');

  // Fallback to db
  tokens = await userTokenPersistence.findBy({ userId, accessToken });

  if (saveToCache && tokens) {
    await cacheService.create('token', tokens);
  }

  return tokens;
};

export const createUserToken = async (userId: string, tokens: Authentication): Promise<Nullable<UserToken>> => {
  const userTokens = await userTokenPersistence.create(userId, tokens.accessToken, tokens.refreshToken);
  if (userTokens) {
    await cacheService.create('token', userTokens);
  }
  return userTokens;
};

export const updateUserToken = async (userId: string, tokens: Authentication, oldAccessToken: string): Promise<Nullable<UserToken>> => {
  const currentTokens = await getUserToken(userId, oldAccessToken);

  if (currentTokens) {
    await userTokenPersistence.remove(userId, oldAccessToken);
    await cacheService.remove('token', userId, oldAccessToken);
  }

  return await createUserToken(userId, tokens);
};

export const removeUserToken = async (userId: string, accessToken: string): Promise<void> => {
  await userTokenPersistence.remove(userId, accessToken);
  await cacheService.remove('token', userId, accessToken);
}

export default {
  generateTokens,
  hashPassword,
  isPasswordValid,
  isTokenValid,
  getUserToken,
  createUserToken,
  updateUserToken,
  removeUserToken,
};
