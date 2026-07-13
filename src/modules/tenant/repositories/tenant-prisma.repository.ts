import { Injectable } from '@nestjs/common';
import { Prisma, Tenant } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { TenantQueryDto } from '../dto/tenant-query.dto';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantStatus } from '../enums/tenant-status.enum';
import { TenantRepository } from '../interfaces/tenant.repository';
import { UpdateTenantDto } from '../dto/update-tenant.dto';

@Injectable()
export class TenantPrismaRepository extends TenantRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateTenantDto): Promise<Tenant> {
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        contactEmail: data.contactEmail,
      },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(pageOptions: TenantQueryDto): Promise<{
    items: Tenant[];
    totalItems: number;
  }> {
    const skip = (pageOptions.page - 1) * pageOptions.limit;

    const where: Prisma.TenantWhereInput = {};

    if (pageOptions.search) {
      where.OR = [
        {
          name: {
            contains: pageOptions.search,
            mode: 'insensitive',
          },
        },
        {
          slug: {
            contains: pageOptions.search,
            mode: 'insensitive',
          },
        },
        {
          contactEmail: {
            contains: pageOptions.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (pageOptions.status === TenantStatus.ACTIVE) {
      where.isSuspended = false;
    }

    if (pageOptions.status === TenantStatus.SUSPENDED) {
      where.isSuspended = true;
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: pageOptions.limit,
        orderBy: {
          [pageOptions.sortBy]: pageOptions.sortOrder,
        },
      }),

      this.prisma.tenant.count({
        where,
      }),
    ]);

    return {
      items,
      totalItems,
    };
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: {
        slug,
      },
    });
  }

  async findByName(name: string): Promise<Tenant | null> {
    return this.prisma.tenant.findFirst({
      where: {
        name,
      },
    });
  }

  async findByContactEmail(email: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: {
        contactEmail: email,
      },
    });
  }
  async update(id: string, data: UpdateTenantDto): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.slug !== undefined && {
          slug: data.slug,
        }),
        ...(data.contactEmail !== undefined && {
          contactEmail: data.contactEmail,
        }),
      },
    });
  }
  async suspend(id: string): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: {
        id,
      },
      data: {
        isSuspended: true,
      },
    });
  }

  async activate(id: string): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: {
        id,
      },
      data: {
        isSuspended: false,
      },
    });
  }
}
