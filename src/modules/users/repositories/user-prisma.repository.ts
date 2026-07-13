import { ConflictException, Injectable } from '@nestjs/common';

import { UserMessages } from '../constants/user.messages';
import { Prisma, UserStatus } from '@prisma/client';
import { USER_SEARCHABLE_FIELDS } from '../constants/user-searchable-fields';
import { UserQueryDto } from '../dto/user-query.dto';

import { PrismaService } from '../../../database/prisma/prisma.service';
import {
  CreateUserData,
  UpdateUserData,
  UserRecord,
  UserRepository,
} from '../interfaces/user.repository';

@Injectable()
export class UserPrismaRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // =========================================
  // Create Operations
  // =========================================

  async create(data: CreateUserData): Promise<UserRecord> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(UserMessages.DUPLICATE_EMAIL);
      }

      throw error;
    }
  }
  // =========================================
  // Read Operations
  // =========================================

  async findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }
  async findAll(query: UserQueryDto): Promise<{
    items: UserRecord[];
    totalItems: number;
  }> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (query.tenantId) {
      where.tenantId = query.tenantId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = USER_SEARCHABLE_FIELDS.map((field) => ({
        [field]: {
          contains: query.search,
          mode: Prisma.QueryMode.insensitive,
        },
      }));
    }

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      items,
      totalItems,
    };
  }

  // =========================================
  // Update Operations
  // =========================================

  async update(id: string, data: UpdateUserData): Promise<UserRecord> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserRecord> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
