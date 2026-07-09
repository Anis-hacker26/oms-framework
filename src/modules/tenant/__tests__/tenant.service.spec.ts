import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { TenantService } from '../services/tenant.service';
import { TENANT_REPOSITORY } from '../constants/tenant.constants';
import { AppLoggerService } from '../../../common/logging/app-logger.service';
import { SortOrder } from '../../../common/pagination/enums/sort-order.enum';
import { TenantStatus } from '../enums/tenant-status.enum';
import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

describe('TenantService', () => {
  let service: TenantService;

  const mockTenantRepository = {
    create: jest.fn(),
    update: jest.fn(),
    suspend: jest.fn(),
    activate: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    findByName: jest.fn(),
    findByContactEmail: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: TENANT_REPOSITORY,
          useValue: mockTenantRepository,
        },
        {
          provide: AppLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  describe('create()', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create tenant successfully', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      const tenant = {
        id: 'tenant-id',
        name: dto.name,
        slug: dto.slug,
        contactEmail: dto.contactEmail,
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);
      mockTenantRepository.findByName.mockResolvedValue(null);
      mockTenantRepository.findByContactEmail.mockResolvedValue(null);
      mockTenantRepository.create.mockResolvedValue(tenant);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(result.id).toBe(tenant.id);
      expect(result.name).toBe(dto.name);
      expect(result.slug).toBe(dto.slug);
      expect(result.contactEmail).toBe(dto.contactEmail);
      expect(result.isSuspended).toBe(false);

      expect(mockTenantRepository.findBySlug).toHaveBeenCalledWith(dto.slug);

      expect(mockTenantRepository.findByName).toHaveBeenCalledWith(dto.name);

      expect(mockTenantRepository.findByContactEmail).toHaveBeenCalledWith(
        dto.contactEmail,
      );

      expect(mockTenantRepository.create).toHaveBeenCalledWith(dto);

      expect(mockLogger.log).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException for duplicate slug', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue({
        id: 'existing-id',
        slug: dto.slug,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.findBySlug).toHaveBeenCalledWith(dto.slug);

      expect(mockTenantRepository.findByName).not.toHaveBeenCalled();

      expect(mockTenantRepository.findByContactEmail).not.toHaveBeenCalled();

      expect(mockTenantRepository.create).not.toHaveBeenCalled();

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException for duplicate name', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue({
        id: 'existing-id',
        name: dto.name,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.findBySlug).toHaveBeenCalled();

      expect(mockTenantRepository.findByName).toHaveBeenCalledWith(dto.name);

      expect(mockTenantRepository.findByContactEmail).not.toHaveBeenCalled();

      expect(mockTenantRepository.create).not.toHaveBeenCalled();

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException for duplicate contact email', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue(null);

      mockTenantRepository.findByContactEmail.mockResolvedValue({
        id: 'existing-id',
        contactEmail: dto.contactEmail,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.findBySlug).toHaveBeenCalled();

      expect(mockTenantRepository.findByName).toHaveBeenCalled();

      expect(mockTenantRepository.findByContactEmail).toHaveBeenCalledWith(
        dto.contactEmail,
      );

      expect(mockTenantRepository.create).not.toHaveBeenCalled();

      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });
    it('should log tenant creation with correct details', async () => {
      const dto = {
        name: 'Microsoft',
        slug: 'microsoft',
        contactEmail: 'admin@microsoft.com',
      };

      const tenant = {
        id: 'tenant-id',
        name: dto.name,
        slug: dto.slug,
        contactEmail: dto.contactEmail,
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);
      mockTenantRepository.findByName.mockResolvedValue(null);
      mockTenantRepository.findByContactEmail.mockResolvedValue(null);
      mockTenantRepository.create.mockResolvedValue(tenant);

      await service.create(dto);

      expect(mockLogger.log).toHaveBeenCalledWith(
        'TenantService',
        'tenant.created',
        'Tenant created successfully.',
        {
          tenantId: tenant.id,
          tenantName: tenant.name,
          tenantSlug: tenant.slug,
        },
      );
    });

    it('should log duplicate slug warning', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'TenantService',
        'tenant.duplicate_slug',
        'Duplicate tenant slug attempted.',
        {
          slug: dto.slug,
        },
      );
    });

    it('should log duplicate name warning', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'TenantService',
        'tenant.duplicate_name',
        'Duplicate tenant name attempted.',
        {
          name: dto.name,
        },
      );
    });

    it('should log duplicate contact email warning', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue(null);

      mockTenantRepository.findByContactEmail.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'TenantService',
        'tenant.duplicate_email',
        'Duplicate tenant contact email attempted.',
        {
          contactEmail: dto.contactEmail,
        },
      );
    });

    it('should propagate repository errors', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);
      mockTenantRepository.findByName.mockResolvedValue(null);
      mockTenantRepository.findByContactEmail.mockResolvedValue(null);

      mockTenantRepository.create.mockRejectedValue(
        new Error('Database unavailable'),
      );

      await expect(service.create(dto)).rejects.toThrow('Database unavailable');

      expect(mockLogger.log).not.toHaveBeenCalled();
    });

    it('should not call create when duplicate slug exists', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.create).not.toHaveBeenCalled();
    });

    it('should not call create when duplicate name exists', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.create).not.toHaveBeenCalled();
    });

    it('should not call create when duplicate email exists', async () => {
      const dto = {
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
      };

      mockTenantRepository.findBySlug.mockResolvedValue(null);

      mockTenantRepository.findByName.mockResolvedValue(null);

      mockTenantRepository.findByContactEmail.mockResolvedValue({
        id: 'existing-id',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(mockTenantRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById()', () => {
    it('should return tenant by id', async () => {
      const tenant = {
        id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTenantRepository.findById.mockResolvedValue(tenant);

      const result = await service.findById(tenant.id);

      expect(result.id).toBe(tenant.id);

      expect(result.name).toBe(tenant.name);

      expect(result.slug).toBe(tenant.slug);

      expect(mockTenantRepository.findById).toHaveBeenCalledWith(tenant.id);
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      const id = '967d397e-fe36-4d3b-9799-a11ec58c6e9d';

      mockTenantRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);

      expect(mockTenantRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException for invalid tenant id', async () => {
      await expect(service.findById('abc')).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTenantRepository.findById).not.toHaveBeenCalled();
    });

    it('should log successful tenant retrieval', async () => {
      const tenant = {
        id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
        name: 'Netflix',
        slug: 'netflix',
        contactEmail: 'admin@netflix.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTenantRepository.findById.mockResolvedValue(tenant);

      await service.findById(tenant.id);

      expect(mockLogger.log).toHaveBeenCalledWith(
        'TenantService',
        'tenant.found',
        'Tenant retrieved successfully.',
        {
          tenantId: tenant.id,
        },
      );
    });

    it('should log failed tenant retrieval', async () => {
      const id = '967d397e-fe36-4d3b-9799-a11ec58c6e9d';

      mockTenantRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'TenantService',
        'tenant.not_found',
        'Tenant not found.',
        {
          tenantId: id,
        },
      );
    });
  });

  describe('findAll()', () => {
    const tenants = [
      {
        id: '1',
        name: 'Google',
        slug: 'google',
        contactEmail: 'admin@google.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Microsoft',
        slug: 'microsoft',
        contactEmail: 'admin@microsoft.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const pageOptions: PageOptionsDto = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: SortOrder.DESC,
      search: undefined,
      status: undefined,
    };

    it('should return paginated tenants', async () => {
      mockTenantRepository.findAll.mockResolvedValue({
        items: tenants,
        totalItems: 2,
      });

      const result = await service.findAll(pageOptions);

      expect(result.items).toHaveLength(2);

      expect(result.meta.page).toBe(1);

      expect(result.meta.limit).toBe(10);

      expect(result.meta.totalItems).toBe(2);

      expect(mockTenantRepository.findAll).toHaveBeenCalledWith(pageOptions);
    });

    it('should return empty list when no tenants exist', async () => {
      mockTenantRepository.findAll.mockResolvedValue({
        items: [],
        totalItems: 0,
      });

      const result = await service.findAll(pageOptions);

      expect(result.items).toEqual([]);

      expect(result.meta.totalItems).toBe(0);
    });

    it('should pass search option to repository', async () => {
      const options = {
        ...pageOptions,
        search: 'google',
      };

      mockTenantRepository.findAll.mockResolvedValue({
        items: [tenants[0]],
        totalItems: 1,
      });

      await service.findAll(options);

      expect(mockTenantRepository.findAll).toHaveBeenCalledWith(options);
    });

    it('should pass ACTIVE status filter to repository', async () => {
      const options = {
        ...pageOptions,
        status: TenantStatus.ACTIVE,
      };

      mockTenantRepository.findAll.mockResolvedValue({
        items: tenants,
        totalItems: 2,
      });

      await service.findAll(options);

      expect(mockTenantRepository.findAll).toHaveBeenCalledWith(options);
    });

    it('should pass SUSPENDED status filter to repository', async () => {
      const options: PageOptionsDto = {
        ...pageOptions,
        status: TenantStatus.SUSPENDED,
      };

      mockTenantRepository.findAll.mockResolvedValue({
        items: [],
        totalItems: 0,
      });

      await service.findAll(options);

      expect(mockTenantRepository.findAll).toHaveBeenCalledWith(options);
    });

    it('should pass combined search and status filter', async () => {
      const options: PageOptionsDto = {
        ...pageOptions,
        search: 'google',
        status: TenantStatus.ACTIVE,
      };

      mockTenantRepository.findAll.mockResolvedValue({
        items: [tenants[0]],
        totalItems: 1,
      });

      await service.findAll(options);

      expect(mockTenantRepository.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('update()', () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update tenant successfully', async () => {
      const dto = {
        name: 'Netflix India',
      };

      const updatedTenant = {
        ...existingTenant,
        ...dto,
      };

      mockTenantRepository.findById.mockResolvedValue(existingTenant);

      mockTenantRepository.findByName.mockResolvedValue(null);

      mockTenantRepository.update.mockResolvedValue(updatedTenant);

      const result = await service.update(existingTenant.id, dto);

      expect(result.name).toBe(dto.name);

      expect(mockTenantRepository.update).toHaveBeenCalledWith(
        existingTenant.id,
        dto,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        'TenantService',
        'tenant.updated',
        'Tenant updated successfully.',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      mockTenantRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(existingTenant.id, {
          name: 'Google',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid uuid', async () => {
      await expect(
        service.update('abc', {
          name: 'Google',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no changes are provided', async () => {
      mockTenantRepository.findById.mockResolvedValue(existingTenant);

      await expect(service.update(existingTenant.id, {})).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTenantRepository.update).not.toHaveBeenCalled();
    });
  });
  it('should throw ConflictException for duplicate name during update', async () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTenantRepository.findById.mockResolvedValue(existingTenant);

    mockTenantRepository.findByName.mockResolvedValue({
      id: 'another-id',
    });

    await expect(
      service.update(existingTenant.id, {
        name: 'Google',
      }),
    ).rejects.toThrow(ConflictException);

    expect(mockTenantRepository.update).not.toHaveBeenCalled();
  });
  it('should throw ConflictException for duplicate slug during update', async () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTenantRepository.findById.mockResolvedValue(existingTenant);

    mockTenantRepository.findBySlug.mockResolvedValue({
      id: 'another-id',
    });

    await expect(
      service.update(existingTenant.id, {
        slug: 'google',
      }),
    ).rejects.toThrow(ConflictException);

    expect(mockTenantRepository.update).not.toHaveBeenCalled();
  });
  it('should throw ConflictException for duplicate contact email during update', async () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTenantRepository.findById.mockResolvedValue(existingTenant);

    mockTenantRepository.findByContactEmail.mockResolvedValue({
      id: 'another-id',
    });

    await expect(
      service.update(existingTenant.id, {
        contactEmail: 'admin@google.com',
      }),
    ).rejects.toThrow(ConflictException);

    expect(mockTenantRepository.update).not.toHaveBeenCalled();
  });
  it('should skip uniqueness validation for unchanged values', async () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTenantRepository.findById.mockResolvedValue(existingTenant);

    await expect(
      service.update(existingTenant.id, {
        name: 'Netflix',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(mockTenantRepository.findByName).not.toHaveBeenCalled();
  });
  it('should log tenant update successfully', async () => {
    const existingTenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTenant = {
      ...existingTenant,
      name: 'Netflix India',
    };

    mockTenantRepository.findById.mockResolvedValue(existingTenant);

    mockTenantRepository.findByName.mockResolvedValue(null);

    mockTenantRepository.update.mockResolvedValue(updatedTenant);

    await service.update(existingTenant.id, {
      name: 'Netflix India',
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      'TenantService',
      'tenant.updated',
      'Tenant updated successfully.',
      expect.objectContaining({
        tenantId: existingTenant.id,
      }),
    );
  });

  describe('suspend()', () => {
    const tenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should suspend tenant successfully', async () => {
      const suspendedTenant = {
        ...tenant,
        isSuspended: true,
      };

      mockTenantRepository.findById.mockResolvedValue(tenant);

      mockTenantRepository.suspend.mockResolvedValue(suspendedTenant);

      const result = await service.suspend(tenant.id);

      expect(result.isSuspended).toBe(true);

      expect(mockTenantRepository.suspend).toHaveBeenCalledWith(tenant.id);
    });

    it('should throw NotFoundException', async () => {
      mockTenantRepository.findById.mockResolvedValue(null);

      await expect(service.suspend(tenant.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for already suspended tenant', async () => {
      mockTenantRepository.findById.mockResolvedValue({
        ...tenant,
        isSuspended: true,
      });

      await expect(service.suspend(tenant.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid uuid', async () => {
      await expect(service.suspend('abc')).rejects.toThrow(BadRequestException);
    });
  });

  describe('activate()', () => {
    const tenant = {
      id: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
      name: 'Netflix',
      slug: 'netflix',
      contactEmail: 'admin@netflix.com',
      isSuspended: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should activate tenant successfully', async () => {
      const activeTenant = {
        ...tenant,
        isSuspended: false,
      };

      mockTenantRepository.findById.mockResolvedValue(tenant);

      mockTenantRepository.activate.mockResolvedValue(activeTenant);

      const result = await service.activate(tenant.id);

      expect(result.isSuspended).toBe(false);

      expect(mockTenantRepository.activate).toHaveBeenCalledWith(tenant.id);
    });

    it('should throw NotFoundException', async () => {
      mockTenantRepository.findById.mockResolvedValue(null);

      await expect(service.activate(tenant.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for already active tenant', async () => {
      mockTenantRepository.findById.mockResolvedValue({
        ...tenant,
        isSuspended: false,
      });

      await expect(service.activate(tenant.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid uuid', async () => {
      await expect(service.activate('abc')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
