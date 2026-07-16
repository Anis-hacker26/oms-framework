import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedTenant } from './seeds/tenant.seed';
import { seedUser } from './seeds/user.seed';
import { seedRolePermissions } from './seeds/role-permission.seed';

async function main() {
  console.log('🌱 Starting database seed...');

  await seedPermissions();

  await seedRoles();

  await seedRolePermissions();

  const tenant = await seedTenant();

  await seedUser(tenant);

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Database seeding failed.');
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });