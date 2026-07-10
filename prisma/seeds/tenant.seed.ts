import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTenant() {
  console.log('🌱 Seeding tenant...');

  const tenant = await prisma.tenant.upsert({
    where: {
      slug: 'oms-demo',
    },
    update: {},
    create: {
      name: 'OMS Demo',
      contactEmail: 'admin@example.com',
      slug: 'oms-demo',
      isActive: true,
      isSuspended: false,
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  return tenant;
}