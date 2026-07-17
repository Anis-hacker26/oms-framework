import { Injectable } from '@nestjs/common';
import { Permission, Role, UserRole } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { UserRoleRepository } from './user-role.repository';

@Injectable()
export class PrismaUserRoleRepository extends UserRoleRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
  ): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

 async removeRoleFromUser(
  userId: string,
  roleId: string,
): Promise<UserRole> {
  throw new Error('Method not implemented.');
}

  async getUserRoles(
    userId: string,
  ): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }

  async getEffectivePermissions(
    userId: string,
  ): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }
}