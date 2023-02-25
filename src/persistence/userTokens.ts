export interface UserToken {
  id: string
  userId: string
  token: string // Access Token
  createdAt: string
}

export const getUserToken = async (userId: string): Promise<UserToken> => {
  return {} as UserToken;
};

export const getByToken = async (token: string): Promise<UserToken> => {
  return {} as UserToken;
};

export const upsertToken = async (userId: string, token: string): Promise<UserToken> => {
  return {} as UserToken;
};

export const removeToken = async (userId: string): Promise<void> => {
  return;
};

export default {
  getUserToken,
  getByToken,
  upsertToken,
  removeToken,
};
