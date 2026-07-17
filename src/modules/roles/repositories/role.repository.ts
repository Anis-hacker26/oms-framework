import { Role } from '@prisma/client';

import { CreateRoleData } from '../interfaces/create-role-data.interface';
import { UpdateRoleData } from '../interfaces/update-role-data.interface';

export abstract class RoleRepository {
  abstract create(
    data: CreateRoleData,
  ): Promise<Role>;

  abstract findById(
    id: string,
  ): Promise<Role | null>;

  abstract findByName(
    tenantId: string | null,
    name: string,
  ): Promise<Role | null>;

  abstract findAll(
    tenantId: string | null,
  ): Promise<Role[]>;

  abstract update(
    id: string,
    data: UpdateRoleData,
  ): Promise<Role>;

  abstract delete(
    id: string,
  ): Promise<Role>;
}