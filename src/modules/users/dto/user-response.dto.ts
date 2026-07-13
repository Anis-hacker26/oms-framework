import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  // =========================================
  // Identity
  // =========================================

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier of the tenant that owns the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  tenantId: string;

  // =========================================
  // Account Information
  // =========================================

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  // =========================================
  // Profile
  // =========================================

  @ApiProperty({
    description: 'First name of the user',
    example: 'Anisha',
  })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Prasad',
    nullable: true,
  })
  lastName: string | null;

  // =========================================
  // Status
  // =========================================

  @ApiProperty({
    description: 'Current lifecycle status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  // =========================================
  // Audit Fields
  // =========================================

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2026-07-11T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2026-07-11T10:00:00.000Z',
  })
  updatedAt: Date;
}
