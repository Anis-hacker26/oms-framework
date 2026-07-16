import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthUser } from '../interfaces/auth-user.interface';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class AuthPrincipalService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async build(
    userId: string,
  ): Promise<AuthenticatedUser> {
    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found.',
      );
    }

    this.validateUser(user);

    this.validateTenant(user);

    const roles =
      await this.roleRepository.getUserRoles(
        user.id,
      );

    const permissions =
      await this.roleRepository.getUserPermissions(
        user.id,
      );

    return {
      ...user,
      roles,
      permissions,
    };
  }

  private validateUser(
    user: AuthUser,
  ): void {
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'User account is inactive.',
      );
    }
  }

  private validateTenant(
    user: AuthUser,
  ): void {
    if (
      !user.tenant.isActive ||
      user.tenant.isSuspended
    ) {
      throw new UnauthorizedException(
        'Tenant is inactive.',
      );
    }
  }
}