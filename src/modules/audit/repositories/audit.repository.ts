import { AuditLog } from '@prisma/client';

import { CreateAuditData } from '../interfaces/create-audit-data.interface';
import { AuditListFilters } from '../interfaces/audit-list-filters.interface';

export abstract class AuditRepository {
  abstract create(
    data: CreateAuditData,
  ): Promise<AuditLog>;

  abstract findById(
    id: string,
  ): Promise<AuditLog | null>;

  abstract findAll(
    filters: AuditListFilters,
  ): Promise<AuditLog[]>;

  abstract count(
    filters: AuditListFilters,
  ): Promise<number>;
}