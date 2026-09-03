import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';

import { PasswordUtil } from '../../auth/utils/password.util';
import { TENANT_REPOSITORY } from '../../tenant/constants/tenant.constants';
import { TenantRepository } from '../../tenant/interfaces/tenant.repository';
import { USER_SORTABLE_FIELDS } from '../constants/user-sortable-fields';
import { UserQueryDto } from '../dto/user-query.dto';
import { UserRegisteredEvent } from '../../event/events/user-registered.event';
import { EventService } from '../../event/services/event.service';

import { PageDto } from '../../../common/pagination/dto/page.dto';
import { PageMetaDto } from '../../../common/pagination/dto/page-meta.dto';
import { USER_REPOSITORY } from '../constants/user.constants';
import { UserMessages } from '../constants/user.messages';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserData, UserRepository } from '../interfaces/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
constructor(
  @Inject(USER_REPOSITORY)
  private readonly userRepository: UserRepository,

  @Inject(TENANT_REPOSITORY)
  private readonly tenantRepository: TenantRepository,

  private readonly eventService: EventService,
) {}

  // =========================================
  // Public Methods
  // =========================================

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const tenant = await this.tenantRepository.findById(data.tenantId);

    if (!tenant) {
      throw new NotFoundException(UserMessages.TENANT_NOT_FOUND);
    }

    if (tenant.isSuspended || !tenant.isActive) {
      throw new BadRequestException(UserMessages.TENANT_INACTIVE);
    }

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException(UserMessages.DUPLICATE_EMAIL);
    }

    const passwordHash = await PasswordUtil.hash(data.password);

    const user = await this.userRepository.create({
      tenantId: data.tenantId,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await this.eventService.publish(
      new UserRegisteredEvent(
        {
          userId: user.id,
          tenantId: user.tenantId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
        },
        {
          tenantId: user.tenantId,
        },
      ),
    );

    return UserMapper.toResponse(user);
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.validateUserId(id);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    return UserMapper.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.validateUserId(id);

    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    if (
      dto.email === undefined &&
      dto.firstName === undefined &&
      dto.lastName === undefined
    ) {
      throw new BadRequestException(UserMessages.NO_CHANGES);
    }

    if (dto.email && dto.email !== existingUser.email) {
      const duplicateUser = await this.userRepository.findByEmail(dto.email);

      if (duplicateUser) {
        throw new ConflictException(UserMessages.DUPLICATE_EMAIL);
      }
    }

    const updateData: UpdateUserData = {};

    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }

    if (dto.firstName !== undefined) {
      updateData.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      updateData.lastName = dto.lastName;
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return UserMapper.toResponse(updatedUser);
  }

  async suspend(id: string): Promise<UserResponseDto> {
    this.validateUserId(id);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new BadRequestException(UserMessages.ALREADY_SUSPENDED);
    }

    const suspendedUser = await this.userRepository.updateStatus(
      id,
      UserStatus.SUSPENDED,
    );

    return UserMapper.toResponse(suspendedUser);
  }

  async activate(id: string): Promise<UserResponseDto> {
    this.validateUserId(id);

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserMessages.NOT_FOUND);
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException(UserMessages.ALREADY_ACTIVE);
    }

    const activatedUser = await this.userRepository.updateStatus(
      id,
      UserStatus.ACTIVE,
    );

    return UserMapper.toResponse(activatedUser);
  }

  async findAll(query: UserQueryDto): Promise<PageDto<UserResponseDto>> {
    this.validateSortField(query.sortBy);

    const { items, totalItems } = await this.userRepository.findAll(query);

    const userDtos = items.map((user) => UserMapper.toResponse(user));

    const meta = new PageMetaDto(query.page, query.limit, totalItems);

    return new PageDto(userDtos, meta);
  }

  // =========================================
  // Private Methods
  // =========================================

  private validateUserId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new BadRequestException(UserMessages.INVALID_ID);
    }
  }

  private validateSortField(sortBy: string): void {
    if (
      !USER_SORTABLE_FIELDS.includes(
        sortBy as (typeof USER_SORTABLE_FIELDS)[number],
      )
    ) {
      throw new BadRequestException(UserMessages.INVALID_SORT_FIELD);
    }
  }
}
