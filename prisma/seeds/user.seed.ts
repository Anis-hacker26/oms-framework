import { Tenant, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { prisma } from '../prisma';

export async function seedUser(
  tenant: Tenant,
): Promise<void> {
  console.log('🌱 Seeding admin user...');

  const passwordHash = await bcrypt.hash(
    'Password@123',
    12,
  );

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@example.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      status: UserStatus.ACTIVE,
    },
  });

  // -----------------------------
  // Find SUPER_ADMIN role
  // -----------------------------
  const superAdminRole = await prisma.role.findFirst({
    where: {
      name: 'SUPER_ADMIN',
      tenantId: null,
    },
  });

  if (!superAdminRole) {
    throw new Error('SUPER_ADMIN role not found.');
  }

  // -----------------------------
  // Assign SUPER_ADMIN role
  // -----------------------------
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(
    `✅ User created: ${user.email} (SUPER_ADMIN assigned)`,
  );
}