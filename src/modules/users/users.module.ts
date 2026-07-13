import { Module } from '@nestjs/common';

import { TenantModule } from '../tenant/tenant.module';
import { UsersController } from './controllers/users.controller';

import { USER_REPOSITORY } from './constants/user.constants';
import { UserPrismaRepository } from './repositories/user-prisma.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TenantModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
