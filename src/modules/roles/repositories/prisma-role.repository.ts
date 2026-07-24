import { Injectable } from '@nestjs/common';
import { Permission, Role, UserRole } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { RoleRepository } from './role.repository';
import { CreateRoleData } from '../interfaces/create-role-data.interface';
import { UpdateRoleData } from '../interfaces/update-role-data.interface';

@Injectable()
export class PrismaRoleRepository extends RoleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // --------------------------------------------------------------------------
  // Role Management
  // --------------------------------------------------------------------------

  async create(data: CreateRoleData): Promise<Role> {
    return this.prisma.role.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description ?? null,
        isSystem: data.isSystem ?? false,
      },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByName(
    tenantId: string | null,
    name: string,
  ): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: {
        tenantId,
        name,
        deletedAt: null,
      },
    });
  }

  async findAll(tenantId: string | null): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async delete(id: string): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // --------------------------------------------------------------------------
  // User Role Assignment
  // --------------------------------------------------------------------------

  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    throw new Error('Method not implemented.');
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    throw new Error('Method not implemented.');
  }

  // --------------------------------------------------------------------------
  // Role Permission Assignment
  // --------------------------------------------------------------------------

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }

  // --------------------------------------------------------------------------
  // Effective Permissions
  // --------------------------------------------------------------------------

  async getEffectivePermissions(userId: string): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }
}
