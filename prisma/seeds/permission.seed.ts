import { prisma } from '../prisma';
import { PERMISSION_DEFINITIONS } from '../../src/common/authorization/constants/permission-definitions';


export async function seedPermissions(): Promise<void> {
  console.log('🌱 Seeding permissions...');

  const permissions = Object.values(
    PERMISSION_DEFINITIONS,
  ).flat();

  await prisma.$transaction(
    permissions.map((permission) =>
      prisma.permission.upsert({
        where: {
          name: permission.name,
        },
        update: {
          description: permission.description,
        },
        create: {
          name: permission.name,
          description: permission.description,
        },
      }),
    ),
  );

  console.log(
    `✅ Seeded ${permissions.length} permissions.`,
  );
}