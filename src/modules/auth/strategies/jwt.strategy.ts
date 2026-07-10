import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { AuthUser } from '../interfaces/auth-user.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(
  private readonly configService: ConfigService,
  private readonly userRepository: UserRepository,
) {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.getOrThrow<string>(
      'JWT_ACCESS_SECRET',
    ),
  });
}

  async validate(
  payload: AccessTokenPayload,
): Promise<AuthUser> {
  const user = await this.userRepository.findById(
    payload.sub,
  );

  if (!user) {
    throw new UnauthorizedException(
      'User not found.',
    );
  }

  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'User account is inactive.',
    );
  }

  if (
    !user.tenant.isActive ||
    user.tenant.isSuspended
  ) {
    throw new UnauthorizedException(
      'Tenant is inactive.',
    );
  }

  return user;
}
}