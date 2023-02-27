import { Nullable } from '@/types';

interface UserTokenPersistenceProps {
  id: string
  user_id: string
  token: string
  created_at?: number
  updated_at?: number
}

class UserToken {
  public id: string;
  private user_id: string;
  public token: string;
  private _created_at?: number;
  private _updated_at?: number;

  constructor(userToken: UserTokenPersistenceProps) {
    this.id = userToken.id;
    this.user_id = userToken.user_id;
    this.token = userToken.token;
    this._created_at = userToken.created_at;
    this._updated_at = userToken.updated_at;
  }

  public get userId(){
    return this.user_id;
  }

  public get createdAt(){
    return this._created_at;
  }

  public get updatedAt(){
    return this._updated_at;
  }

  // From persistence storage to User object
  static fromDynamic(userToken?: UserTokenPersistenceProps): Nullable<UserToken> {
    if (!userToken?.id
      || !userToken.user_id
      || !userToken.token) {
      return null;
    }
  
    return new UserToken({
      id: userToken.id,
      user_id: userToken.user_id,
      token: userToken.token,
      created_at: userToken.created_at,
      updated_at: userToken.updated_at,
    });
  }

  // From User object to persistence storage
  public toDynamic(): Record<string, any> {
    return {
      id: this.id,
      user_id: this.user_id,
      token: this.token,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };
  }
}

export default UserToken;
