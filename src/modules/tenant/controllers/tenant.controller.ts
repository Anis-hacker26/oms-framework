import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { TenantService } from '../services/tenant.service';

import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { TenantResponseDto } from '../dto/tenant-response.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { TenantMessages } from '../constants/tenant.messages';

import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { PageDto } from '../../../common/pagination/dto/page.dto';
import { TenantQueryDto } from '../dto/tenant-query.dto';

import { Permissions } from '../../../common/authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../common/authorization/guards/permissions.guard';
import { Permission } from '../../../common/authorization/enums/permission.enum';


@ApiBearerAuth('access-token')
@ApiTags('Tenant')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}


  // =========================================
  // Create Operations
  // =========================================

  @Permissions(Permission.TENANT_CREATE)
  @Post()
  @SuccessMessage(TenantMessages.CREATED)
  @ApiOperation({
    summary: 'Create Tenant',
    description: 'Creates a new tenant in the OMS Framework.',
  })
  @ApiBody({
    type: CreateTenantDto,
    description: 'Tenant creation request.',
  })
  @ApiCreatedResponse({
    description: TenantMessages.CREATED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed. One or more request fields are invalid.',
  })
  @ApiConflictResponse({
    description: 'Tenant name, slug or contact email already exists.',
  })
  async create(@Body() dto: CreateTenantDto): Promise<TenantResponseDto> {
    return this.tenantService.create(dto);
  }


  // =========================================
  // Read Operations
  // =========================================

  @Permissions(Permission.TENANT_READ)
  @Get(':id')
  @SuccessMessage(TenantMessages.RETRIEVED)
  @ApiOperation({
    summary: 'Get Tenant by ID',
    description: 'Retrieves a tenant using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant UUID',
    example: 'df24b6f9-3768-4994-a41c-66a14fc6e0cd',
  })
  @ApiOkResponse({
    description: TenantMessages.RETRIEVED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: TenantMessages.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: TenantMessages.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<TenantResponseDto> {
    return this.tenantService.findById(id);
  }


  // =========================================
  // List Operations
  // =========================================

  @Permissions(Permission.TENANT_READ)
  @Get()
  @SuccessMessage(TenantMessages.LIST_RETRIEVED)
  @ApiOperation({
    summary: 'List Tenants',
    description:
      'Returns a paginated list of tenants with search, sorting and status filtering.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'google',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'ACTIVE',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
  })
  @ApiOkResponse({
    description: TenantMessages.LIST_RETRIEVED,
    type: PageDto,
  })
  async findAll(
    @Query() pageOptions: TenantQueryDto,
  ): Promise<PageDto<TenantResponseDto>> {
    return this.tenantService.findAll(pageOptions);
  }

  // =========================================
  // Update Operations
  // =========================================


  @Permissions(Permission.TENANT_UPDATE)
  @Patch(':id')
  @SuccessMessage(TenantMessages.UPDATED)
  @ApiOperation({
    summary: 'Update Tenant',
    description:
      'Updates an existing tenant. Only the fields provided in the request will be modified.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant UUID',
    example: 'df24b6f9-3768-4994-a41c-66a14fc6e0cd',
  })
  @ApiBody({
    type: UpdateTenantDto,
    description: 'Fields to update. All fields are optional.',
  })
  @ApiOkResponse({
    description: TenantMessages.UPDATED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid tenant ID or invalid request payload.',
  })
  @ApiConflictResponse({
    description: 'Tenant name, slug or contact email already exists.',
  })
  @ApiNotFoundResponse({
    description: TenantMessages.NOT_FOUND,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<TenantResponseDto> {
    return this.tenantService.update(id, dto);
  }


  // =========================================
  // Suspend Operations
  // =========================================

  @Permissions(Permission.TENANT_SUSPEND)
  @Patch(':id/suspend')
  @SuccessMessage(TenantMessages.SUSPENDED)
  @ApiOperation({
    summary: 'Suspend Tenant',
    description: 'Suspends an existing tenant.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant UUID',
  })
  @ApiOkResponse({
    description: TenantMessages.SUSPENDED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: TenantMessages.ALREADY_SUSPENDED,
  })
  @ApiNotFoundResponse({
    description: TenantMessages.NOT_FOUND,
  })
  async suspend(@Param('id') id: string): Promise<TenantResponseDto> {
    return this.tenantService.suspend(id);
  }


  // =========================================
  // Activate Operations
  // =========================================

  @Permissions(Permission.TENANT_ACTIVATE)
  @Patch(':id/activate')
  @SuccessMessage(TenantMessages.ACTIVATED)
  @ApiOperation({
    summary: 'Activate Tenant',
    description: 'Activates a suspended tenant.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant UUID',
  })
  @ApiOkResponse({
    description: TenantMessages.ACTIVATED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: TenantMessages.ALREADY_ACTIVE,
  })
  @ApiNotFoundResponse({
    description: TenantMessages.NOT_FOUND,
  })
  async activate(@Param('id') id: string): Promise<TenantResponseDto> {
    return this.tenantService.activate(id);
  }
}
