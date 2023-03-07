import { Entity, Schema } from 'redis-om';
import { Nullable, Serializable } from '@/types';

interface UserTokenPersistenceProps {
  id: string
  userId: string
  accessToken: string
  refreshToken: string
  createdAt?: number
  updatedAt?: number
  entityId?: string // Caching ID
}

/** @note Defining Cache schema does duplicate some code. It could be done with code-generation. */

class Tokens extends Entity {};
export const tokensSchema = new Schema(Tokens, {
  id: { type: 'string' },
  user_id: { type: 'string' },
  access_token: { type: 'string' },
  refresh_token: { type: 'string' },
  created_at: { type: 'date' },
  updated_at: { type: 'date' },
});

class UserToken extends Serializable {
  public id: string;
  public userId: string;
  public accessToken: string;
  public refreshToken: string;
  public createdAt?: number;
  public updatedAt?: number;
  public entityId?: string; // Caching ID

  constructor(userToken: UserTokenPersistenceProps) {
    super();
    this.id = userToken.id;
    this.userId = userToken.userId;
    this.accessToken = userToken.accessToken;
    this.refreshToken = userToken.refreshToken;
    this.createdAt = userToken.createdAt;
    this.updatedAt = userToken.updatedAt;
    this.entityId = userToken.entityId;
  }

  // From persistence storage to User object
  static fromDynamic(userToken?: Record<string, any>): Nullable<UserToken> {
    if (!userToken?.id
      || !userToken.user_id
      || !userToken.access_token
      || !userToken.refresh_token) {
      return null;
    }
  
    return new UserToken({
      id: userToken.id,
      userId: userToken.user_id,
      accessToken: userToken.access_token,
      refreshToken: userToken.refresh_token,
      createdAt: userToken.created_at,
      updatedAt: userToken.updated_at,
      entityId: userToken.entityId,
    });
  }

  // From User object to persistence storage
  public toDynamic(): Record<string, any> {
    return {
      id: this.id,
      user_id: this.userId,
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      entityId: this.entityId,
    };
  }
}

export default UserToken;
