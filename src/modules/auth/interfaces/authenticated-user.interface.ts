import { AuthUser } from './auth-user.interface';

/**
 * Represents an authenticated user after
 * authentication and authorization have been
 * resolved.
 *
 * This extends the basic AuthUser by including
 * the user's effective roles and permissions.
 */
export interface AuthenticatedUser extends AuthUser {
  /**
   * Role names assigned to the user.
   */
  roles: string[];

  /**
   * Effective permissions resolved from all
   * assigned roles.
   */
  permissions: string[];
}