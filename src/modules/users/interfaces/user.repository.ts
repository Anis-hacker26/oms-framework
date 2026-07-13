import { UserStatus } from '@prisma/client';

import { UserQueryDto } from '../dto/user-query.dto';
export interface CreateUserData {
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string | null;
  status: UserStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<UserRecord>;

  abstract findById(id: string): Promise<UserRecord | null>;

  abstract findAll(query: UserQueryDto): Promise<{
    items: UserRecord[];
    totalItems: number;
  }>;

  abstract findByEmail(email: string): Promise<UserRecord | null>;

  abstract update(id: string, data: UpdateUserData): Promise<UserRecord>;

  abstract updateStatus(id: string, status: UserStatus): Promise<UserRecord>;
}
