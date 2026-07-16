import { prisma } from '../prisma';
import { ROLE_DEFINITIONS } from '../../src/common/authorization/constants/role-definitions';

export async function seedRoles(): Promise<void> {
  console.log('🌱 Seeding system roles...');

  for (const role of ROLE_DEFINITIONS) {
    const existingRole = await prisma.role.findFirst({
      where: {
        tenantId: null,
        name: role.name,
      },
    });

    if (existingRole) {
      await prisma.role.update({
        where: {
          id: existingRole.id,
        },
        data: {
          description: role.description,
          isSystem: role.isSystem,
        },
      });

      continue;
    }

    await prisma.role.create({
      data: {
        tenantId: null,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
    });
  }

  console.log(
    `✅ Seeded ${ROLE_DEFINITIONS.length} system roles.`,
  );
}