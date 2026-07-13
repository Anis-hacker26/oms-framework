import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { UserMessages } from '../constants/user.messages';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { PageDto } from '../../../common/pagination/dto/page.dto';
import { UserQueryDto } from '../dto/user-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================================
  // Create Operations
  // =========================================

  @Post()
  @SuccessMessage(UserMessages.CREATED)
  @ApiOperation({
    summary: 'Create User',
    description: 'Creates a new user for an active tenant.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation request.',
  })
  @ApiCreatedResponse({
    description: UserMessages.CREATED,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or the tenant is inactive or suspended.',
  })
  @ApiConflictResponse({
    description: UserMessages.DUPLICATE_EMAIL,
  })
  @ApiNotFoundResponse({
    description: UserMessages.TENANT_NOT_FOUND,
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  // =========================================
  // Read Operations
  // =========================================

  @Get(':id')
  @SuccessMessage(UserMessages.RETRIEVED)
  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Retrieves a user using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiOkResponse({
    description: UserMessages.RETRIEVED,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: UserMessages.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: UserMessages.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update User',
    description:
      'Updates an existing user. Only the fields provided in the request will be modified.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update. All fields are optional.',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user ID or invalid request payload.',
  })
  @ApiConflictResponse({
    description: 'User email already exists.',
  })
  @ApiNotFoundResponse({
    description: UserMessages.NOT_FOUND,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/suspend')
  @ApiOperation({
    summary: 'Suspend User',
    description: 'Suspends an existing user.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: UserMessages.SUSPENDED,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: UserMessages.ALREADY_SUSPENDED,
  })
  @ApiNotFoundResponse({
    description: UserMessages.NOT_FOUND,
  })
  async suspend(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.suspend(id);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate User',
    description: 'Activates a suspended user.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: UserMessages.ACTIVATED,
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: UserMessages.ALREADY_ACTIVE,
  })
  @ApiNotFoundResponse({
    description: UserMessages.NOT_FOUND,
  })
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.activate(id);
  }

  @Get()
  @ApiOperation({
    summary: 'List Users',
    description:
      'Returns a paginated list of users with search, sorting, status filtering and tenant filtering.',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully.',
    type: PageDto,
  })
  async findAll(
    @Query() query: UserQueryDto,
  ): Promise<PageDto<UserResponseDto>> {
    return this.usersService.findAll(query);
  }
}
