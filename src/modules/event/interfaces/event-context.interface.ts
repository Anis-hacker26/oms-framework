export interface EventContext {
  eventId?: string;
  eventVersion?: number;
  occurredAt?: Date;

  tenantId?: string;
  correlationId?: string;

  metadata?: Record<string, unknown>;
}