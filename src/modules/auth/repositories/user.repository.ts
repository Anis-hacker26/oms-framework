import { AuthUser } from '../interfaces/auth-user.interface';
export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>;

  abstract findById(id: string): Promise<AuthUser | null>;

  abstract updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<void>;

  abstract updateLastLogin(userId: string): Promise<void>;
}