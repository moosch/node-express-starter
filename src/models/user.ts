import { Nullable, Serializable } from '@/types';

interface UserPersistenceProps {
  id: string
  email: string
  password: string
  created_at?: number
  updated_at?: number
}

class User extends Serializable {
  public id: string;
  public email: string;
  public password: string;
  private _created_at?: number;
  private _updated_at?: number;

  constructor(user: UserPersistenceProps) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this._created_at = user.created_at;
    this._updated_at = user.updated_at;
  }

  public get createdAt(){
    return this._created_at;
  }

  public get updatedAt(){
    return this._updated_at;
  }

  // From persistence storage to User object.
  static fromDynamic(user?: Record<string, any>): Nullable<User> {
    if (!user?.id
      || !user?.email
      || !user?.password
      || !user?.created_at) {
      return null;
    }

    return new User({
      id: user.id,
      email: user.email,
      password: user.password,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }

  // From User object to persistence storage.
  public toDynamic(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      created_at: this._created_at,
      updated_at: this._updated_at,
    };
  }

  // For client responses.
  public toJson(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this._created_at,
    };
  }
}

export default User;
