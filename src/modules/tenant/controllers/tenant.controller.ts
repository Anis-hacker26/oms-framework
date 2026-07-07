import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { TenantService } from '../services/tenant.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { TenantResponseDto } from '../dto/tenant-response.dto';
import { TenantMessages } from '../constants/tenant.messages';

import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { PageDto } from '../../../common/pagination/dto/page.dto';
import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

@ApiTags('Tenant')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @SuccessMessage(TenantMessages.CREATED)
  @ApiOperation({
    summary: 'Create Tenant',
    description:
      'Creates a new tenant in the OMS Framework. Tenant name, slug, and contact email must all be unique.',
  })
  @ApiBody({
    type: CreateTenantDto,
    description: 'Tenant creation request payload.',
  })
  @ApiCreatedResponse({
    description: TenantMessages.CREATED,
    type: TenantResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed. One or more request fields are invalid.',
  })
  @ApiConflictResponse({
    description: 'Tenant name, slug, or contact email already exists.',
  })
  async create(@Body() dto: CreateTenantDto): Promise<TenantResponseDto> {
    return this.tenantService.create(dto);
  }

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
    description: 'Invalid tenant identifier.',
  })
  @ApiNotFoundResponse({
    description: TenantMessages.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<TenantResponseDto> {
    return this.tenantService.findById(id);
  }

  @Get()
  @SuccessMessage(TenantMessages.LIST_RETRIEVED)
  @ApiOperation({
    summary: 'List Tenants',
    description: 'Returns a paginated list of tenants.',
  })
  @ApiOkResponse({
    description: TenantMessages.LIST_RETRIEVED,
  })
  async findAll(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<PageDto<TenantResponseDto>> {
    return this.tenantService.findAll(pageOptions);
  }
}
