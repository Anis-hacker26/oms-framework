import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserStatus } from '@prisma/client';

import { PasswordUtil } from '../../auth/utils/password.util';
import { TENANT_REPOSITORY } from '../../tenant/constants/tenant.constants';
import { TenantRepository } from '../../tenant/interfaces/tenant.repository';

import { USER_REPOSITORY } from '../constants/user.constants';
import { UserMessages } from '../constants/user.messages';
import { UserQueryDto } from '../dto/user-query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  CreateUserData,
  UserRecord,
  UserRepository,
} from '../interfaces/user.repository';
import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<UserRepository>;
  let tenantRepository: jest.Mocked<TenantRepository>;

  const tenantId = '550e8400-e29b-41d4-a716-446655440001';

  const createUserDto: CreateUserDto = {
    tenantId,
    email: 'user@example.com',
    password: 'SecurePassword123!',
    firstName: 'Anisha',
    lastName: 'Prasad',
  };

  const tenant = {
    id: tenantId,
    name: 'Test Tenant',
    slug: 'test-tenant',
    contactEmail: 'tenant@example.com',
    isActive: true,
    isSuspended: false,
    suspendedAt: null,
    suspendedReason: null,
    metadata: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const user: UserRecord = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    tenantId,
    email: createUserDto.email,
    passwordHash: 'hashed-password',
    firstName: createUserDto.firstName,
    lastName: createUserDto.lastName ?? null,
    status: UserStatus.ACTIVE,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: TENANT_REPOSITORY,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            suspend: jest.fn(),
            activate: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            findByName: jest.fn(),
            findByContactEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(USER_REPOSITORY);
    tenantRepository = module.get(TENANT_REPOSITORY);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =========================================
  // Create User
  // =========================================

  describe('create', () => {
    it('should create a user successfully', async () => {
      tenantRepository.findById.mockResolvedValue(tenant);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(user);

      jest.spyOn(PasswordUtil, 'hash').mockResolvedValue('hashed-password');

      const result = await service.create(createUserDto);

      expect(tenantRepository.findById).toHaveBeenCalledWith(tenantId);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(PasswordUtil.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(userRepository.create).toHaveBeenCalledWith({
        tenantId,
        email: createUserDto.email,
        passwordHash: 'hashed-password',
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      } satisfies CreateUserData);

      expect(result).toEqual({
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      tenantRepository.findById.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new NotFoundException(UserMessages.TENANT_NOT_FOUND),
      );

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when tenant is suspended', async () => {
      tenantRepository.findById.mockResolvedValue({
        ...tenant,
        isSuspended: true,
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException(UserMessages.TENANT_INACTIVE),
      );

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when tenant is inactive', async () => {
      tenantRepository.findById.mockResolvedValue({
        ...tenant,
        isActive: false,
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new BadRequestException(UserMessages.TENANT_INACTIVE),
      );

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      tenantRepository.findById.mockResolvedValue(tenant);
      userRepository.findByEmail.mockResolvedValue(user);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException(UserMessages.DUPLICATE_EMAIL),
      );

      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  // =========================================
  // Get User by ID
  // =========================================

  describe('findById', () => {
    it('should return a user successfully', async () => {
      userRepository.findById.mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(userRepository.findById).toHaveBeenCalledWith(user.id);

      expect(result).toEqual({
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('should throw BadRequestException when user ID is invalid', async () => {
      const invalidId = 'invalid-user-id';

      await expect(service.findById(invalidId)).rejects.toThrow(
        new BadRequestException(UserMessages.INVALID_ID),
      );

      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440003';

      userRepository.findById.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(
        new NotFoundException(UserMessages.NOT_FOUND),
      );

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  // =========================================
  // List Users
  // =========================================

  describe('findAll', () => {
    it('should return paginated users successfully', async () => {
      const query = new UserQueryDto();

      userRepository.findAll.mockResolvedValue({
        items: [user],
        totalItems: 1,
      });

      const result = await service.findAll(query);

      expect(userRepository.findAll).toHaveBeenCalledWith(query);

      expect(result.items).toEqual([
        {
          id: user.id,
          tenantId: user.tenantId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      ]);

      expect(result.meta).toBeDefined();
      expect(result.meta.totalItems).toBe(1);
    });

    it('should return an empty paginated result when no users exist', async () => {
      const query = new UserQueryDto();

      userRepository.findAll.mockResolvedValue({
        items: [],
        totalItems: 0,
      });

      const result = await service.findAll(query);

     expect(result.items).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should pass tenant, status and search filters to repository', async () => {
      const query = new UserQueryDto();

      query.tenantId = '550e8400-e29b-41d4-a716-446655440001';
      query.status = UserStatus.ACTIVE;
      query.search = 'anisha';

      userRepository.findAll.mockResolvedValue({
        items: [user],
        totalItems: 1,
      });

      await service.findAll(query);

      expect(userRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should throw BadRequestException for invalid sort field', async () => {
      const query = new UserQueryDto();

      query.sortBy = 'passwordHash';

      await expect(service.findAll(query)).rejects.toThrow(
        new BadRequestException(UserMessages.INVALID_SORT_FIELD),
      );

      expect(userRepository.findAll).not.toHaveBeenCalled();
    });
  });
});
