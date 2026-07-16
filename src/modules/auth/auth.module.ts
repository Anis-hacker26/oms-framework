import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { AuthController } from './controllers/auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { RoleRepository } from './repositories/role.repository';
import { PrismaRoleRepository } from './repositories/prisma-role.repository';

import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_ACCESS_EXPIRES_IN',
          ) as StringValue,
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

 providers: [
  AuthService,
  TokenService,
  JwtStrategy,

  {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  },

  {
    provide: RefreshTokenRepository,
    useClass: PrismaRefreshTokenRepository,
  },

  {
    provide: RoleRepository,
    useClass: PrismaRoleRepository,
  },
],

  exports: [
    AuthService,
  ],
})
export class AuthModule {}