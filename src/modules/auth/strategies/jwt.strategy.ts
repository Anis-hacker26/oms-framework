import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { AuthUser } from '../interfaces/auth-user.interface';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive.');
    }

    if (!user.tenant.isActive || user.tenant.isSuspended) {
      throw new UnauthorizedException('Tenant is inactive.');
    }

    const roles = await this.roleRepository.getUserRoles(user.id);

    const permissions = await this.roleRepository.getUserPermissions(user.id);

    return {
      ...user,
      roles,
      permissions,
    };
  }
}
