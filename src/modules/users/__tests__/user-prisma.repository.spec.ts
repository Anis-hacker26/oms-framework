import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { UserMessages } from '../constants/user.messages';
import { CreateUserData } from '../interfaces/user.repository';
import { UserPrismaRepository } from '../repositories/user-prisma.repository';

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;

  const prisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const createUserData: CreateUserData = {
    tenantId: '550e8400-e29b-41d4-a716-446655440001',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    firstName: 'Anisha',
    lastName: 'Prasad',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new UserPrismaRepository(prisma as unknown as PrismaService);
  });

  // =========================================
  // Create Operations
  // =========================================

  describe('create', () => {
    it('should translate Prisma P2002 into ConflictException', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed.',
        {
          code: 'P2002',
          clientVersion: '6.16.3',
          meta: {
            target: ['email'],
          },
        },
      );

      prisma.user.create.mockRejectedValue(prismaError);

      await expect(repository.create(createUserData)).rejects.toThrow(
        new ConflictException(UserMessages.DUPLICATE_EMAIL),
      );

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserData,
      });
    });

    it('should rethrow unknown persistence errors', async () => {
      const persistenceError = new Error('Database unavailable.');

      prisma.user.create.mockRejectedValue(persistenceError);

      await expect(repository.create(createUserData)).rejects.toBe(
        persistenceError,
      );
    });
  });

  // =========================================
  // Read Operations
  // =========================================

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          tenantId: createUserData.tenantId,
          email: createUserData.email,
          passwordHash: createUserData.passwordHash,
          firstName: createUserData.firstName,
          lastName: createUserData.lastName,
          status: 'ACTIVE',
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prisma.$transaction.mockResolvedValue([users, 1]);

      const result = await repository.findAll({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'asc',
      } as any);

      expect(result).toEqual({
        items: users,
        totalItems: 1,
      });

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    });
  });

  it('should build Prisma query using tenant, status and search filters', async () => {
  prisma.$transaction.mockResolvedValue([[], 0]);

  await repository.findAll({
    page: 2,
    limit: 5,
    tenantId: '550e8400-e29b-41d4-a716-446655440001',
    status: 'ACTIVE' as any,
    search: 'anisha',
    sortBy: 'createdAt',
    sortOrder: 'asc',
  } as any);

  expect(prisma.user.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        deletedAt: null,
        tenantId: '550e8400-e29b-41d4-a716-446655440001',
        status: 'ACTIVE',
      }),
      skip: 5,
      take: 5,
      orderBy: {
        createdAt: 'asc',
      },
    }),
  );
});
});
