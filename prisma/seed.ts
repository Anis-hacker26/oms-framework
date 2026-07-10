import { seedTenant } from './seeds/tenant.seed';
import { seedUser } from './seeds/user.seed';

async function main() {
  console.log('🌱 Starting database seed...');

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
  .finally(async () => {
    process.exit(0);
  });