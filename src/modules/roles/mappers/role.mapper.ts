import { Role } from '@prisma/client';

import { RoleResponse } from '../interfaces/role-response.interface';

export class RoleMapper {
  static toResponse(role: Role): RoleResponse {
    return {
      id: role.id,
      tenantId: role.tenantId,

      name: role.name,
      description: role.description,

      isSystem: role.isSystem,

      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static toResponseList(roles: Role[]): RoleResponse[] {
    return roles.map((role) => this.toResponse(role));
  }
}