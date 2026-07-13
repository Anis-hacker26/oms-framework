import { Tenant } from '@prisma/client';

import { TenantQueryDto } from '../dto/tenant-query.dto';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

export abstract class TenantRepository {
  abstract create(data: CreateTenantDto): Promise<Tenant>;

  abstract update(id: string, data: UpdateTenantDto): Promise<Tenant>;

  abstract suspend(id: string): Promise<Tenant>;

  abstract activate(id: string): Promise<Tenant>;

  abstract findById(id: string): Promise<Tenant | null>;

  abstract findAll(query: TenantQueryDto): Promise<{
    items: Tenant[];
    totalItems: number;
  }>;

  abstract findBySlug(slug: string): Promise<Tenant | null>;

  abstract findByName(name: string): Promise<Tenant | null>;

  abstract findByContactEmail(email: string): Promise<Tenant | null>;
}
