import { Injectable } from '@nestjs/common';
import { Permission, RolePermission } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { RolePermissionRepository } from './role-permission.repository';

@Injectable()
export class PrismaRolePermissionRepository extends RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission> {
    throw new Error('Method not implemented.');
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission> {
    throw new Error('Method not implemented.');
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }
}
