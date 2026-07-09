import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';

import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UserRepository } from '../repositories/user.repository';

import { TokenService } from './token.service';
import { PasswordUtil } from '../utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  // =====================================================
  // Public Methods
  // =====================================================

 async login(
  loginDto: LoginDto,
): Promise<LoginResponseDto> {
  const user = await this.userRepository.findByEmail(
    loginDto.email,
  );

  if (!user) {
    throw new UnauthorizedException(
      'Invalid email or password.',
    );
  }

  const isPasswordValid =
    await PasswordUtil.compare(
      loginDto.password,
      user.passwordHash,
    );

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      'Invalid email or password.',
    );
  }

  this.validateUserStatus(user);

  this.validateTenantStatus(user);

  const sessionId = randomUUID();

const tokens = await this.generateTokenPair(
  user,
  sessionId,
);

const refreshTokenHash = await PasswordUtil.hash(
  tokens.refreshToken,
);

const refreshTokenExpiresAt =
  this.tokenService.getRefreshTokenExpiryDate();

await this.refreshTokenRepository.create(
  sessionId,
  user.id,
  refreshTokenHash,
  refreshTokenExpiresAt,
);

await this.userRepository.updateLastLogin(user.id);

return tokens;
}

  async refresh(): Promise<void> {
    throw new Error('Not implemented.');
  }

  async logout(): Promise<void> {
    throw new Error('Not implemented.');
  }

  // =====================================================
  // Private Methods
  // =====================================================

  private async generateTokenPair(
    user: AuthUser,
    sessionId: string,
  ): Promise<LoginResponseDto> {
    const accessTokenPayload =
      this.buildAccessTokenPayload(user);

    const refreshTokenPayload =
      this.buildRefreshTokenPayload(
        user,
        sessionId,
      );

    const accessToken =
      await this.tokenService.generateAccessToken(
        accessTokenPayload,
      );

    const refreshToken =
      await this.tokenService.generateRefreshToken(
        refreshTokenPayload,
      );

    return {
  accessToken,
  refreshToken,
  expiresIn: 900,
  tokenType: 'Bearer',
};
  }

  private buildAccessTokenPayload(
    user: AuthUser,
  ): AccessTokenPayload {
    return {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      type: 'access',
    };
  }

  private buildRefreshTokenPayload(
    user: AuthUser,
    sessionId: string,
  ): RefreshTokenPayload {
    return {
      sub: user.id,
      sessionId,
      type: 'refresh',
    };
  }

  private validateUserStatus(user: AuthUser): void {
  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedException(
      'Your account has been suspended. Please contact your administrator.',
    );
  }
}

private validateTenantStatus(user: AuthUser): void {
  if (!user.tenant.isActive || user.tenant.isSuspended) {
    throw new UnauthorizedException(
      'Your organization account is not active.',
    );
  }
}

}