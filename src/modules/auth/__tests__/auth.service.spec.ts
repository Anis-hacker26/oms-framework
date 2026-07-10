import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenService } from '../services/token.service';
import { PasswordUtil } from '../utils/password.util';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockRefreshTokenRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    revoke: jest.fn(),
    revokeAll: jest.fn(),
    deleteExpired: jest.fn(),
  };

  const mockTokenService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    getRefreshTokenExpiryDate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UserRepository,
            useValue: mockUserRepository,
          },
          {
            provide: RefreshTokenRepository,
            useValue: mockRefreshTokenRepository,
          },
          {
            provide: TokenService,
            useValue: mockTokenService,
          },
        ],
      }).compile();

    service =
      module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully', async () => {
  const loginDto = {
    email: 'admin@example.com',
    password: 'Password@123',
  };

  const user = {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@example.com',
    passwordHash: 'hashed-password',
    status: 'ACTIVE' as const,
    tenant: {
      id: 'tenant-1',
      isActive: true,
      isSuspended: false,
    },
  };

  mockUserRepository.findByEmail.mockResolvedValue(user);

  jest.spyOn(
  PasswordUtil,
  'compare',
)
    .mockResolvedValue(true);

  mockTokenService.generateAccessToken.mockResolvedValue(
    'access-token',
  );

  mockTokenService.generateRefreshToken.mockResolvedValue(
    'refresh-token',
  );

  mockTokenService.getRefreshTokenExpiryDate.mockReturnValue(
    new Date(),
  );

  mockRefreshTokenRepository.create.mockResolvedValue(
    undefined,
  );

  mockUserRepository.updateLastLogin.mockResolvedValue(
    undefined,
  );

  const result = await service.login(loginDto);

  expect(result).toEqual({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 900,
    tokenType: 'Bearer',
  });

  expect(
    mockUserRepository.findByEmail,
  ).toHaveBeenCalledWith(loginDto.email);

  expect(
    mockRefreshTokenRepository.create,
  ).toHaveBeenCalled();

  expect(
    mockUserRepository.updateLastLogin,
  ).toHaveBeenCalledWith(user.id);
});

it('should throw UnauthorizedException when user does not exist', async () => {
  const loginDto = {
    email: 'unknown@example.com',
    password: 'Password@123',
  };

  mockUserRepository.findByEmail.mockResolvedValue(null);

  await expect(
    service.login(loginDto),
  ).rejects.toThrow(
    'Invalid email or password.',
  );

  expect(
    mockUserRepository.findByEmail,
  ).toHaveBeenCalledWith(loginDto.email);
});

it('should throw UnauthorizedException for invalid password', async () => {
  const loginDto = {
    email: 'admin@example.com',
    password: 'WrongPassword',
  };

  const user = {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@example.com',
    passwordHash: 'hashed-password',
    status: 'ACTIVE' as const,
    tenant: {
      id: 'tenant-1',
      isActive: true,
      isSuspended: false,
    },
  };

  mockUserRepository.findByEmail.mockResolvedValue(user);

  jest.spyOn(
  PasswordUtil,
  'compare',
)
    .mockResolvedValue(false);

  await expect(
    service.login(loginDto),
  ).rejects.toThrow(
    'Invalid email or password.',
  );

  expect(
    mockUserRepository.findByEmail,
  ).toHaveBeenCalledWith(loginDto.email);
});

it('should throw UnauthorizedException for suspended user', async () => {
  const loginDto = {
    email: 'admin@example.com',
    password: 'Password@123',
  };

  const user = {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@example.com',
    passwordHash: 'hashed-password',
    status: 'SUSPENDED' as const,
    tenant: {
      id: 'tenant-1',
      isActive: true,
      isSuspended: false,
    },
  };

  mockUserRepository.findByEmail.mockResolvedValue(user);

  jest
    .spyOn(
      PasswordUtil,
      'compare',
    )
    .mockResolvedValue(true);

  await expect(
    service.login(loginDto),
  ).rejects.toThrow(
    'Your account has been suspended. Please contact your administrator.',
  );
});

it('should throw UnauthorizedException for suspended tenant', async () => {
  const loginDto = {
    email: 'admin@example.com',
    password: 'Password@123',
  };

  const user = {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@example.com',
    passwordHash: 'hashed-password',
    status: 'ACTIVE' as const,
    tenant: {
      id: 'tenant-1',
      isActive: false,
      isSuspended: true,
    },
  };

  mockUserRepository.findByEmail.mockResolvedValue(user);

  jest
    .spyOn(
      PasswordUtil,
      'compare',
    )
    .mockResolvedValue(true);

  await expect(
    service.login(loginDto),
  ).rejects.toThrow(
    'Your organization account is not active.',
  );
});

});