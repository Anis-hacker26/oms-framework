import { AuditAction, AuditSeverity } from '@prisma/client';

export interface AuditListFilters {
  tenantId?: string;
  userId?: string;

  action?: AuditAction;
  severity?: AuditSeverity;

  entityType?: string;
  entityId?: string;

  requestId?: string;
  correlationId?: string;

  search?: string;

  from?: Date;
  to?: Date;

  page: number;
  limit: number;

  sortBy: string;
  sortOrder: 'asc' | 'desc';
}