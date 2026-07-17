import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TENANT_REPOSITORY } from '../constants/tenant.constants';
import { TENANT_SORTABLE_FIELDS } from '../constants/tenant-sortable-fields';
import { TenantMessages } from '../constants/tenant.messages';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { TenantResponseDto } from '../dto/tenant-response.dto';

import { TenantRepository } from '../interfaces/tenant.repository';
import { TenantMapper } from '../mappers/tenant.mapper';

import { AppLoggerService } from '../../../common/logging/app-logger.service';

import { PageDto } from '../../../common/pagination/dto/page.dto';
import { PageMetaDto } from '../../../common/pagination/dto/page-meta.dto';
import { TenantQueryDto } from '../dto/tenant-query.dto';

@Injectable()
export class TenantService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,

    private readonly logger: AppLoggerService,
  ) {}

  async create(dto: CreateTenantDto): Promise<TenantResponseDto> {
    await this.validateUniqueSlug(dto.slug);

    await this.validateUniqueName(dto.name);

    await this.validateUniqueContactEmail(dto.contactEmail);

    const tenant = await this.tenantRepository.create(dto);

    this.logger.log('TenantService', 'tenant.created', TenantMessages.CREATED, {
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
    });

    return TenantMapper.toResponseDto(tenant);
  }

  async findById(id: string): Promise<TenantResponseDto> {
    this.validateTenantId(id);

    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) {
      this.logger.warn(
        'TenantService',
        'tenant.not_found',
        TenantMessages.NOT_FOUND,
        {
          tenantId: id,
        },
      );

      throw new NotFoundException(TenantMessages.NOT_FOUND);
    }

    this.logger.log('TenantService', 'tenant.found', TenantMessages.RETRIEVED, {
      tenantId: tenant.id,
    });

    return TenantMapper.toResponseDto(tenant);
  }

  async findAll(
  pageOptions: TenantQueryDto,
  ): Promise<PageDto<TenantResponseDto>> {
    this.logger.log(
      'TenantService',
      'tenant.list_requested',
      'Tenant list requested.',
    );

    this.validateSortField(pageOptions.sortBy);

    const { items, totalItems } =
      await this.tenantRepository.findAll(pageOptions);

    const tenantDtos = items.map((tenant) =>
      TenantMapper.toResponseDto(tenant),
    );

    const meta = new PageMetaDto(
      pageOptions.page,
      pageOptions.limit,
      totalItems,
    );

    return new PageDto(tenantDtos, meta);
  }

  async update(id: string, dto: UpdateTenantDto): Promise<TenantResponseDto> {
    this.validateTenantId(id);

    const existingTenant = await this.tenantRepository.findById(id);

    if (!existingTenant) {
      this.logger.warn(
        'TenantService',
        'tenant.not_found',
        TenantMessages.NOT_FOUND,
        {
          tenantId: id,
        },
      );

      throw new NotFoundException(TenantMessages.NOT_FOUND);
    }

    if (!this.hasChanges(existingTenant, dto)) {
      throw new BadRequestException(TenantMessages.NO_CHANGES);
    }

    if (dto.name !== undefined && dto.name !== existingTenant.name) {
      await this.validateUniqueName(dto.name);
    }

    if (dto.slug !== undefined && dto.slug !== existingTenant.slug) {
      await this.validateUniqueSlug(dto.slug);
    }

    if (
      dto.contactEmail !== undefined &&
      dto.contactEmail !== existingTenant.contactEmail
    ) {
      await this.validateUniqueContactEmail(dto.contactEmail);
    }

    const updatedTenant = await this.tenantRepository.update(id, dto);

    this.logger.log('TenantService', 'tenant.updated', TenantMessages.UPDATED, {
      tenantId: updatedTenant.id,
      updatedFields: Object.keys(dto),
    });

    return TenantMapper.toResponseDto(updatedTenant);
  }

  async suspend(id: string): Promise<TenantResponseDto> {
    this.validateTenantId(id);

    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) {
      this.logger.warn(
        'TenantService',
        'tenant.not_found',
        TenantMessages.NOT_FOUND,
        {
          tenantId: id,
        },
      );

      throw new NotFoundException(TenantMessages.NOT_FOUND);
    }

    if (tenant.isSuspended) {
      throw new BadRequestException(TenantMessages.ALREADY_SUSPENDED);
    }

    const suspendedTenant = await this.tenantRepository.suspend(id);

    this.logger.log(
      'TenantService',
      'tenant.suspended',
      TenantMessages.SUSPENDED,
      {
        tenantId: suspendedTenant.id,
      },
    );

    return TenantMapper.toResponseDto(suspendedTenant);
  }

  async activate(id: string): Promise<TenantResponseDto> {
    this.validateTenantId(id);

    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) {
      this.logger.warn(
        'TenantService',
        'tenant.not_found',
        TenantMessages.NOT_FOUND,
        {
          tenantId: id,
        },
      );

      throw new NotFoundException(TenantMessages.NOT_FOUND);
    }

    if (!tenant.isSuspended) {
      throw new BadRequestException(TenantMessages.ALREADY_ACTIVE);
    }

    const activatedTenant = await this.tenantRepository.activate(id);

    this.logger.log(
      'TenantService',
      'tenant.activated',
      TenantMessages.ACTIVATED,
      {
        tenantId: activatedTenant.id,
      },
    );

    return TenantMapper.toResponseDto(activatedTenant);
  }
  private hasChanges(
    existingTenant: {
      name: string;
      slug: string;
      contactEmail: string;
    },
    dto: UpdateTenantDto,
  ): boolean {
    return (
      (dto.name !== undefined && dto.name !== existingTenant.name) ||
      (dto.slug !== undefined && dto.slug !== existingTenant.slug) ||
      (dto.contactEmail !== undefined &&
        dto.contactEmail !== existingTenant.contactEmail)
    );
  }

  private validateTenantId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new BadRequestException(TenantMessages.INVALID_ID);
    }
  }

  private validateSortField(sortBy: string): void {
    if (
      !TENANT_SORTABLE_FIELDS.includes(
        sortBy as (typeof TENANT_SORTABLE_FIELDS)[number],
      )
    ) {
      throw new BadRequestException(TenantMessages.INVALID_SORT_FIELD);
    }
  }

  private async validateUniqueSlug(slug: string): Promise<void> {
    const existingSlug = await this.tenantRepository.findBySlug(slug);

    if (existingSlug) {
      this.logger.warn(
        'TenantService',
        'tenant.duplicate_slug',
        'Duplicate tenant slug attempted.',
        {
          slug,
        },
      );

      throw new ConflictException(TenantMessages.DUPLICATE_SLUG);
    }
  }

  private async validateUniqueName(name: string): Promise<void> {
    const existingName = await this.tenantRepository.findByName(name);

    if (existingName) {
      this.logger.warn(
        'TenantService',
        'tenant.duplicate_name',
        'Duplicate tenant name attempted.',
        {
          name,
        },
      );

      throw new ConflictException(TenantMessages.DUPLICATE_NAME);
    }
  }

  private async validateUniqueContactEmail(email: string): Promise<void> {
    const existingEmail = await this.tenantRepository.findByContactEmail(email);

    if (existingEmail) {
      this.logger.warn(
        'TenantService',
        'tenant.duplicate_email',
        'Duplicate tenant contact email attempted.',
        {
          contactEmail: email,
        },
      );

      throw new ConflictException(TenantMessages.DUPLICATE_EMAIL);
    }
  }
}
