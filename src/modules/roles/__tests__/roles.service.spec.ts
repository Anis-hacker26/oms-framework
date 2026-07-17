import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { RolesService } from '../services/roles.service';
import { RoleRepository } from '../repositories/role.repository';
import { RoleMessages } from '../constants/role.messages';

describe('RolesService', () => {
  let service: RolesService;

  const mockRoleRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          RolesService,
          {
            provide: RoleRepository,
            useValue: mockRoleRepository,
          },
        ],
      }).compile();

    service = module.get<RolesService>(
      RolesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});