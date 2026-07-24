import { Injectable, UnauthorizedException } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { LogoutResponseDto } from '../dto/logout-response.dto';
import { LogoutAllResponseDto } from '../dto/logout-all-response.dto';

import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../repositories/role.repository';

import { TokenService } from './token.service';
import { PasswordUtil } from '../utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly roleRepository: RoleRepository,
    private readonly tokenService: TokenService,
  ) {}

  // =====================================================
  // Public Methods
  // =====================================================

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await PasswordUtil.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    this.validateUserStatus(user);

    this.validateTenantStatus(user);

    const sessionId = randomUUID();

    const tokens = await this.generateTokenPair(user, sessionId);

    await this.createRefreshTokenSession(
      sessionId,
      user.id,
      tokens.refreshToken,
    );

    await this.userRepository.updateLastLogin(user.id);

    return tokens;
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    const payload = await this.tokenService.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );

    const storedToken = await this.refreshTokenRepository.findById(
      payload.sessionId,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    const isTokenValid = await PasswordUtil.compare(
      refreshTokenDto.refreshToken,
      storedToken.tokenHash,
    );

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.refreshTokenRepository.revoke(storedToken.id);

    const user = await this.userRepository.findById(storedToken.userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    this.validateUserStatus(user);

    this.validateTenantStatus(user);

    const newSessionId = randomUUID();

    const tokens = await this.generateTokenPair(user, newSessionId);

    await this.createRefreshTokenSession(
      newSessionId,
      user.id,
      tokens.refreshToken,
    );

    await this.userRepository.updateLastLogin(user.id);

    return tokens;
  }

  async logout(logoutDto: LogoutDto): Promise<LogoutResponseDto> {
    const payload = await this.tokenService.verifyRefreshToken(
      logoutDto.refreshToken,
    );

    const storedToken = await this.refreshTokenRepository.findById(
      payload.sessionId,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException(
        'Refresh token has already been revoked.',
      );
    }

    await this.refreshTokenRepository.revoke(storedToken.id);

    return {
      message: 'Logged out successfully.',
    };
  }

  async logoutAll(logoutDto: LogoutDto): Promise<LogoutAllResponseDto> {
    const payload = await this.tokenService.verifyRefreshToken(
      logoutDto.refreshToken,
    );

    const storedToken = await this.refreshTokenRepository.findById(
      payload.sessionId,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException(
        'Refresh token has already been revoked.',
      );
    }

    await this.refreshTokenRepository.revokeAll(storedToken.userId);

    return {
      message: 'Logged out from all devices successfully.',
    };
  }
  // =====================================================
  // Private Methods
  // =====================================================

  private async generateTokenPair(
    user: AuthUser,
    sessionId: string,
  ): Promise<LoginResponseDto> {
    const accessTokenPayload = this.buildAccessTokenPayload(user);

    const refreshTokenPayload = this.buildRefreshTokenPayload(user, sessionId);

    const accessToken =
      await this.tokenService.generateAccessToken(accessTokenPayload);

    const refreshToken =
      await this.tokenService.generateRefreshToken(refreshTokenPayload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    };
  }

  private async createRefreshTokenSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenHash = await PasswordUtil.hash(refreshToken);

    const refreshTokenExpiresAt = this.tokenService.getRefreshTokenExpiryDate();

    await this.refreshTokenRepository.create(
      sessionId,
      userId,
      refreshTokenHash,
      refreshTokenExpiresAt,
    );
  }

  private buildAccessTokenPayload(user: AuthUser): AccessTokenPayload {
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

  private async buildAuthenticatedUser(
    user: AuthUser,
  ): Promise<AuthenticatedUser> {
    const roles = await this.roleRepository.getUserRoles(user.id);

    const permissions = await this.roleRepository.getUserPermissions(user.id);

    return {
      ...user,
      roles,
      permissions,
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
