import { UseGuards } from '@nestjs/common';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { Permissions } from '../../../common/authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../common/authorization/guards/permissions.guard';
import { Permission } from '../../../common/authorization/enums/permission.enum';

import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { RoleMessages } from '../constants/role.messages';

import { RoleResponseDto } from '../dto/role-response.dto';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RolesService } from '../services/roles.service';

@ApiBearerAuth('access-token')
@ApiTags('Roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions(Permission.ROLE_CREATE)
  @Post()
  @SuccessMessage(RoleMessages.ROLE_CREATED)
  @ApiOperation({
    summary: 'Create Role',
    description: 'Creates a new role for a tenant or as a system role.',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role creation request.',
  })
  @ApiCreatedResponse({
    description: RoleMessages.ROLE_CREATED,
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed. One or more request fields are invalid.',
  })
  @ApiConflictResponse({
    description: RoleMessages.ROLE_ALREADY_EXISTS,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Permissions(Permission.ROLE_READ)
  @Get()
  @SuccessMessage(RoleMessages.ROLE_LIST_RETRIEVED)
  @ApiOperation({
    summary: 'List Roles',
    description:
      'Returns all roles for the specified tenant. If tenantId is omitted, system roles are returned.',
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Tenant UUID',
    example: 'df24b6f9-3768-4994-a41c-66a14fc6e0cd',
  })
  @ApiOkResponse({
    description: RoleMessages.ROLE_LIST_RETRIEVED,
    type: RoleResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findAll(
    @Query('tenantId') tenantId?: string,
  ): Promise<RoleResponseDto[]> {
    return this.rolesService.findAll(tenantId ?? null);
  }

  @Permissions(Permission.ROLE_READ)
  @Get(':id')
  @SuccessMessage(RoleMessages.ROLE_RETRIEVED)
  @ApiOperation({
    summary: 'Get Role by ID',
    description: 'Retrieves a role using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: RoleMessages.ROLE_RETRIEVED,
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid role ID.',
  })
  @ApiNotFoundResponse({
    description: RoleMessages.ROLE_NOT_FOUND,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findById(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.findById(id);
  }

  @Permissions(Permission.ROLE_UPDATE)
  @Patch(':id')
  @SuccessMessage(RoleMessages.ROLE_UPDATED)
  @ApiOperation({
    summary: 'Update Role',
    description:
      'Updates an existing role. Only the fields provided in the request will be modified.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Fields to update. All fields are optional.',
  })
  @ApiOkResponse({
    description: RoleMessages.ROLE_UPDATED,
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid role ID or invalid request payload.',
  })
  @ApiConflictResponse({
    description: RoleMessages.ROLE_ALREADY_EXISTS,
  })
  @ApiForbiddenResponse({
    description: RoleMessages.SYSTEM_ROLE_PROTECTED,
  })
  @ApiNotFoundResponse({
    description: RoleMessages.ROLE_NOT_FOUND,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Permissions(Permission.ROLE_DELETE)
  @Delete(':id')
  @SuccessMessage(RoleMessages.ROLE_DELETED)
  @ApiOperation({
    summary: 'Delete Role',
    description:
      'Soft deletes an existing role. System roles cannot be deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: RoleMessages.ROLE_DELETED,
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid role ID.',
  })
  @ApiForbiddenResponse({
    description: RoleMessages.SYSTEM_ROLE_PROTECTED,
  })
  @ApiNotFoundResponse({
    description: RoleMessages.ROLE_NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.rolesService.delete(id);
  }
}
