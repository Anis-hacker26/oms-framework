/**
 * Repository contract for Role and Permission operations.
 *
 * This repository is responsible for retrieving
 * user roles and effective permissions.
 *
 * Role assignment and management APIs will be
 * implemented in later sprints.
 */
export abstract class RoleRepository {
  /**
   * Returns all role names assigned to the user.
   */
  abstract getUserRoles(userId: string): Promise<string[]>;

  /**
   * Returns all effective permissions assigned
   * to the user through their roles.
   */
  abstract getUserPermissions(userId: string): Promise<string[]>;
}
