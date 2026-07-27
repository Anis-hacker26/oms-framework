import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { AUDIT_DEFAULT_LIMIT } from '../constants/audit.constants';
import { AuditMessages } from '../constants/audit.messages';

import { CreateAuditDto } from '../dto/create-audit.dto';
import { AuditQueryDto } from '../dto/audit-query.dto';
import { AuditResponseDto } from '../dto/audit-response.dto';

import { AuditMapper } from '../mappers/audit.mapper';

import { AuditRepository } from '../repositories/audit.repository';

@Injectable()
export class AuditService {
  constructor(
    @Inject(AuditRepository)
    private readonly auditRepository: AuditRepository,

    private readonly auditMapper: AuditMapper,
  ) {}

  async create(
    dto: CreateAuditDto,
  ): Promise<AuditResponseDto> {
    const audit = await this.auditRepository.create(
      this.auditMapper.toCreateData(dto),
    );

    return this.auditMapper.toResponseDto(audit);
  }

  async findById(
    id: string,
  ): Promise<AuditResponseDto> {
    const audit = await this.auditRepository.findById(id);

    if (!audit) {
      throw new NotFoundException(
        AuditMessages.AUDIT_NOT_FOUND,
      );
    }

    return this.auditMapper.toResponseDto(audit);
  }

  async findAll(
    query: AuditQueryDto,
  ) {
    const filters = {
      tenantId: query.tenantId,
      userId: query.userId,
      action: query.action,
      severity: query.severity,
      entityType: query.entityType,
      entityId: query.entityId,
      requestId: query.requestId,
      correlationId: query.correlationId,
      search: query.search,

      from: query.from
        ? new Date(query.from)
        : undefined,

      to: query.to
        ? new Date(query.to)
        : undefined,

      page: query.page ?? 1,

      limit:
        query.limit ??
        AUDIT_DEFAULT_LIMIT,

      sortBy: query.sortBy ?? 'createdAt',

      sortOrder: query.sortOrder ?? 'desc',
    };

    const [items, total] = await Promise.all([
      this.auditRepository.findAll(filters),
      this.auditRepository.count(filters),
    ]);

    return {
      items: this.auditMapper.toResponseDtos(items),

      pagination: {
        page: filters.page,

        limit: filters.limit,

        total,

        totalPages: Math.ceil(
          total / filters.limit,
        ),
      },
    };
  }
}