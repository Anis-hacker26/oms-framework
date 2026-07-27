import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateAuditDto } from '../dto/create-audit.dto';
import { AuditResponseDto } from '../dto/audit-response.dto';

import { CreateAuditData } from '../interfaces/create-audit-data.interface';
import { AuditResponse } from '../interfaces/audit-response.interface';

@Injectable()
export class AuditMapper {
  toCreateData(dto: CreateAuditDto): CreateAuditData {
    return {
      tenantId: dto.tenantId,
      userId: dto.userId,

      action: dto.action,

      entityType: dto.entityType,
      entityId: dto.entityId,

      description: dto.description,

      severity: dto.severity,

      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,

      requestId: dto.requestId,
      correlationId: dto.correlationId,

      metadata: dto.metadata as Prisma.JsonValue,
    };
  }

  toResponseDto(audit: AuditResponse): AuditResponseDto {
    return {
      id: audit.id,

      tenantId: audit.tenantId,

      userId: audit.userId,

      action: audit.action,

      entityType: audit.entityType,
      entityId: audit.entityId,

      description: audit.description,

      severity: audit.severity,

      ipAddress: audit.ipAddress,
      userAgent: audit.userAgent,

      requestId: audit.requestId,
      correlationId: audit.correlationId,

      metadata: audit.metadata as Record<string, unknown> | null,

      createdAt: audit.createdAt,
    };
  }

  toResponseDtos(audits: AuditResponse[]): AuditResponseDto[] {
    return audits.map((audit) => this.toResponseDto(audit));
  }
}