import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class PrismaRefreshTokenRepository extends RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

async create(
  sessionId: string,
  userId: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await this.prisma.userRefreshToken.create({
    data: {
      id: sessionId,
      userId,
      tokenHash,
      expiresAt,
    },
  });
}

  async findById(sessionId: string) {
    return this.prisma.userRefreshToken.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          include: {
            tenant: true,
          },
        },
      },
    });
  }

  async revoke(sessionId: string): Promise<void> {
    await this.prisma.userRefreshToken.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAll(userId: string): Promise<void> {
    await this.prisma.userRefreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.userRefreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}