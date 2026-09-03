import { randomUUID } from 'node:crypto';

import type { DomainEvent } from '../interfaces/domain-event.interface';
import type { EventContext } from '../interfaces/event-context.interface';

export abstract class BaseDomainEvent<TPayload = unknown>
  implements DomainEvent<TPayload>
{
  readonly eventId: string;

  readonly eventName: string;

  readonly eventVersion: number;

  readonly payload: TPayload;

  readonly occurredAt: Date;

  readonly tenantId?: string;

  readonly correlationId?: string;

  readonly metadata?: Record<string, unknown>;

protected constructor(
  eventName: string,
  payload: TPayload,
  context?: EventContext,
) {
  this.eventId = context?.eventId ?? randomUUID();

  this.eventName = eventName;

  this.eventVersion = context?.eventVersion ?? 1;

  this.payload = payload;

  this.occurredAt = context?.occurredAt ?? new Date();

  this.tenantId = context?.tenantId;

  this.correlationId = context?.correlationId;

  this.metadata = context?.metadata;
}
}