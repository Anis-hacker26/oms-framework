import { UserStatus } from '@prisma/client';

export interface UserRegisteredEventPayload {
  userId: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string | null;
  status: UserStatus;
}
