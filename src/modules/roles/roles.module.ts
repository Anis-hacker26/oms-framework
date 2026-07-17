import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

import { RoleRepository } from './repositories/role.repository';
import { PrismaRoleRepository } from './repositories/prisma-role.repository';

import { UserRoleRepository } from './repositories/user-role.repository';
import { PrismaUserRoleRepository } from './repositories/prisma-user-role.repository';

import { RolePermissionRepository } from './repositories/role-permission.repository';
import { PrismaRolePermissionRepository } from './repositories/prisma-role-permission.repository';
import { RoleMapper } from './mappers/role.mapper';

@Module({
  imports: [PrismaModule],

  controllers: [RolesController],

  providers: [
    RolesService,

     RoleMapper,

    {
      provide: RoleRepository,
      useClass: PrismaRoleRepository,
    },

    {
      provide: UserRoleRepository,
      useClass: PrismaUserRoleRepository,
    },

    {
      provide: RolePermissionRepository,
      useClass: PrismaRolePermissionRepository,
    },
  ],

  exports: [
    RolesService,
    RoleRepository,
    UserRoleRepository,
    RolePermissionRepository,
  ],
})
export class RolesModule {}