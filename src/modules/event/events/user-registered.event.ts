import { BaseDomainEvent } from './base-domain.event';

import type { EventContext } from '../interfaces/event-context.interface';
import type { UserRegisteredEventPayload } from '../interfaces/user-registered-event-payload.interface';

export class UserRegisteredEvent
  extends BaseDomainEvent<UserRegisteredEventPayload>
{
  constructor(
    payload: UserRegisteredEventPayload,
    context?: EventContext,
  ) {
    super(
      'user.registered',
      payload,
      context,
    );
  }
}
