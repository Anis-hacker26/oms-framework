import { PrismaClient, Tenant, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  console.log(`✅ User created: ${user.email}`);
}