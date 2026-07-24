import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

import type { StringValue } from 'ms';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_EXPIRES_IN',
      ) as StringValue,
    });
  }

  async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ) as StringValue,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload & JwtPayload>(
      token,
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  getRefreshTokenExpiryDate(): Date {
    const refreshTokenExpiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const expiresAt = new Date();

    switch (refreshTokenExpiresIn) {
      case '7d':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;

      case '30d':
        expiresAt.setDate(expiresAt.getDate() + 30);
        break;

      case '1d':
        expiresAt.setDate(expiresAt.getDate() + 1);
        break;

      default:
        throw new Error(
          `Unsupported JWT_REFRESH_EXPIRES_IN value: ${refreshTokenExpiresIn}`,
        );
    }

    return expiresAt;
  }
}
