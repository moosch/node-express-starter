import { Nullable, Serializable } from '@/types';

interface UserPersistenceProps {
  id: string
  email: string
  password: string
  createdAt?: number
  updatedAt?: number
}

class User extends Serializable {
  public id: string;
  public email: string;
  public password: string;
  public createdAt?: number;
  public updatedAt?: number;

  constructor(user: UserPersistenceProps) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
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
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  }

  // From User object to persistence storage.
  public toDynamic(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  // For client responses.
  public toJson(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default User;
