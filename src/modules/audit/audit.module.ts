import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { AuditController } from './controllers/audit.controller';

import { AuditMapper } from './mappers/audit.mapper';

import { PrismaAuditRepository } from './repositories/prisma-audit.repository';
import { AuditRepository } from './repositories/audit.repository';

import { AuditService } from './services/audit.service';

@Module({
  imports: [PrismaModule],

  controllers: [AuditController],

  providers: [
    AuditService,
    AuditMapper,

    {
      provide: AuditRepository,
      useClass: PrismaAuditRepository,
    },
  ],

  exports: [AuditService],
})
export class AuditModule {}