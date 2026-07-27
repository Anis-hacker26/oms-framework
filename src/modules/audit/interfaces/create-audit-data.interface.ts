import { AuditAction, AuditSeverity, Prisma } from '@prisma/client';

export interface CreateAuditData {
  tenantId: string;
  userId?: string | null;

  action: AuditAction;

  entityType: string;
  entityId?: string | null;

  description: string;

  severity?: AuditSeverity;

  ipAddress?: string | null;
  userAgent?: string | null;

  requestId?: string | null;
  correlationId?: string | null;

  metadata?: Prisma.JsonValue | null;
}