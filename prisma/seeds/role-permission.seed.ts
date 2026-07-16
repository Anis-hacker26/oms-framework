import { prisma } from '../prisma';

import { SYSTEM_ROLE_PERMISSIONS } from '../../src/common/authorization/constants/system-role-permissions';

export async function seedRolePermissions(): Promise<void> {
  console.log('🌱 Seeding role permissions...');

  for (const [roleName, permissions] of Object.entries(
    SYSTEM_ROLE_PERMISSIONS,
  )) {
    const role = await prisma.role.findFirst({
      where: {
        name: roleName,
        tenantId: null,
      },
    });

    if (!role) {
      throw new Error(`Role '${roleName}' not found.`);
    }

    for (const permissionName of permissions) {
      const permission = await prisma.permission.findUnique({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        throw new Error(
          `Permission '${permissionName}' not found.`,
        );
      }

      const existingAssignment =
        await prisma.rolePermission.findFirst({
          where: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });

      if (existingAssignment) {
        continue;
      }

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('✅ Role permissions seeded.');
}