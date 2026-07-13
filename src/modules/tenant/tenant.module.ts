import { Module } from '@nestjs/common';

import { TENANT_REPOSITORY } from './constants/tenant.constants';
import { TenantController } from './controllers/tenant.controller';
import { TenantPrismaRepository } from './repositories/tenant-prisma.repository';
import { TenantService } from './services/tenant.service';

@Module({
  controllers: [TenantController],
  providers: [
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantPrismaRepository,
    },
    TenantService,
  ],
  exports: [TenantService, TENANT_REPOSITORY],
})
export class TenantModule {}
