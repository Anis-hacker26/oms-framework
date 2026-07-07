import { Tenant } from '@prisma/client';

import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

export abstract class TenantRepository {
  abstract create(
    data: CreateTenantDto,
  ): Promise<Tenant>;

  abstract findById(
    id: string,
  ): Promise<Tenant | null>;

  abstract findAll(
    pageOptions: PageOptionsDto,
  ): Promise<{
    items: Tenant[];
    totalItems: number;
  }>;

  abstract update(
    id: string,
    data: UpdateTenantDto,
  ): Promise<Tenant>;

  abstract findBySlug(
    slug: string,
  ): Promise<Tenant | null>;

  abstract findByName(
    name: string,
  ): Promise<Tenant | null>;

  abstract findByContactEmail(
    email: string,
  ): Promise<Tenant | null>;
}