import { Injectable } from '@nestjs/common';
import { AuditLog, Prisma } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { CreateAuditData } from '../interfaces/create-audit-data.interface';
import { AuditListFilters } from '../interfaces/audit-list-filters.interface';
import { AuditRepository } from './audit.repository';

@Injectable()
export class PrismaAuditRepository extends AuditRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private buildWhereClause(
  filters: AuditListFilters,
): Prisma.AuditLogWhereInput {
  return {
    tenantId: filters.tenantId,
    userId: filters.userId,

    action: filters.action,
    severity: filters.severity,

    entityType: filters.entityType,
    entityId: filters.entityId,

    requestId: filters.requestId,
    correlationId: filters.correlationId,

    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from && {
              gte: filters.from,
            }),
            ...(filters.to && {
              lte: filters.to,
            }),
          },
        }
      : {}),

    ...(filters.search && {
      OR: [
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          entityType: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          requestId: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          correlationId: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ],
    }),
  };
}

  async create(
    data: CreateAuditData,
  ): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        severity: data.severity,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        requestId: data.requestId,
        correlationId: data.correlationId,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(
    filters: AuditListFilters,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
        where: this.buildWhereClause(filters),

      orderBy: {
        [filters.sortBy]: filters.sortOrder,
      },

      skip: (filters.page - 1) * filters.limit,

      take: filters.limit,
    });
  }

  async count(
    filters: AuditListFilters,
  ): Promise<number> {
    return this.prisma.auditLog.count({
    where: this.buildWhereClause(filters),
    });
  }
}