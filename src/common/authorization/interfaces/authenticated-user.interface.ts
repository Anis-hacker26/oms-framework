import { Permission } from '../enums/permission.enum';

/**
 * Represents the authenticated user attached to the request
 * after successful JWT validation.
 *
 * This interface contains only the information required
 * for authorization decisions and downstream business logic.
 */
export interface AuthenticatedUser {
  /**
   * Unique identifier of the authenticated user.
   */
  id: string;

  /**
   * Tenant to which the user belongs.
   */
  tenantId: string;

  /**
   * User email address.
   */
  email: string;

  /**
   * Assigned role names.
   */
  roles: string[];

  /**
   * Effective permissions granted to the user.
   */
  permissions: Permission[];
}