export interface DomainEvent<TPayload = unknown> {
  /**
   * Unique identifier for the event.
   */
  readonly eventId: string;

  /**
   * Unique event name.
   * Example: "order.created"
   */
  readonly eventName: string;

  /**
   * Event schema version.
   */
  readonly eventVersion: number;

  /**
   * Event payload.
   */
  readonly payload: TPayload;

  /**
   * Timestamp when the event occurred.
   */
  readonly occurredAt: Date;

  /**
   * Optional tenant identifier.
   */
  readonly tenantId?: string;

  /**
   * Optional correlation identifier.
   */
  readonly correlationId?: string;

  /**
   * Optional metadata.
   */
  readonly metadata?: Record<string, unknown>;
}