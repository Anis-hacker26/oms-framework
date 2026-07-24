import { Permission, RolePermission } from '@prisma/client';

export abstract class RolePermissionRepository {
  abstract assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission>;

  abstract removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission>;

  abstract getRolePermissions(roleId: string): Promise<Permission[]>;
}
