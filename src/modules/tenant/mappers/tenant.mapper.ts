import { Tenant } from '@prisma/client';

import { TenantResponseDto } from '../dto/tenant-response.dto';

export class TenantMapper {
  static toResponseDto(
    tenant: Tenant,
  ): TenantResponseDto {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      contactEmail: tenant.contactEmail,
      isSuspended: tenant.isSuspended,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }
}