import { Permission, Role, UserRole } from '@prisma/client';

export abstract class UserRoleRepository {
  abstract assignRoleToUser(userId: string, roleId: string): Promise<UserRole>;

  abstract removeRoleFromUser(
    userId: string,
    roleId: string,
  ): Promise<UserRole>;

  abstract getUserRoles(userId: string): Promise<Role[]>;

  abstract getEffectivePermissions(userId: string): Promise<Permission[]>;
}
