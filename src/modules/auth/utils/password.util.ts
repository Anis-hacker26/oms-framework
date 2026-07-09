import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  /**
   * Number of salt rounds used for password hashing.
   * This value should be moved to configuration in a later step.
   */
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a plain-text password.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain-text password against a hashed password.
   */
  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}