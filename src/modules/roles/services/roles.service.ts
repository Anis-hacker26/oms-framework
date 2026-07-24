import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoleMessages } from '../constants/role.messages';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleData } from '../interfaces/create-role-data.interface';
import { RoleResponse } from '../interfaces/role-response.interface';
import { UpdateRoleData } from '../interfaces/update-role-data.interface';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.tenantId ?? null,
      createRoleDto.name,
    );

    if (existingRole) {
      throw new ConflictException(RoleMessages.ROLE_ALREADY_EXISTS);
    }

    const roleData: CreateRoleData = {
      tenantId: createRoleDto.tenantId ?? null,
      name: createRoleDto.name,
      description: createRoleDto.description ?? null,
      isSystem: createRoleDto.isSystem ?? false,
    };

    const role = await this.roleRepository.create(roleData);

    return RoleMapper.toResponse(role);
  }

  async findById(id: string): Promise<RoleResponse> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    return RoleMapper.toResponse(role);
  }

  async findAll(tenantId: string | null): Promise<RoleResponse[]> {
    const roles = await this.roleRepository.findAll(tenantId);

    return RoleMapper.toResponseList(roles);
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    if (existingRole.isSystem) {
      throw new ForbiddenException(RoleMessages.SYSTEM_ROLE_PROTECTED);
    }

    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const duplicateRole = await this.roleRepository.findByName(
        existingRole.tenantId,
        updateRoleDto.name,
      );

      if (duplicateRole) {
        throw new ConflictException(RoleMessages.ROLE_ALREADY_EXISTS);
      }
    }

    const updateData: UpdateRoleData = {
      name: updateRoleDto.name,
      description: updateRoleDto.description ?? null,
    };

    const updatedRole = await this.roleRepository.update(id, updateData);

    return RoleMapper.toResponse(updatedRole);
  }

  async delete(id: string): Promise<RoleResponse> {
    const existingRole = await this.roleRepository.findById(id);

    if (!existingRole) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    if (existingRole.isSystem) {
      throw new ForbiddenException(RoleMessages.SYSTEM_ROLE_PROTECTED);
    }

    const deletedRole = await this.roleRepository.delete(id);

    return RoleMapper.toResponse(deletedRole);
  }
}
