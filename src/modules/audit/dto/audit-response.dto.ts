import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditSeverity } from '@prisma/client';

export class AuditResponseDto {
  @ApiProperty({
    example: '7a4e2f1c-4a7d-4d5e-bd5b-3d5f5f8d1234',
  })
  id: string;

  @ApiProperty({
    example: '2e0d0f54-f13c-4c7c-9a4d-84d72c99b001',
  })
  tenantId: string;

  @ApiPropertyOptional({
    example: '5c57b0d2-3d0e-45a5-a548-1baf55d6d8d8',
  })
  userId?: string | null;

  @ApiProperty({
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  action: AuditAction;

  @ApiProperty({
    example: 'Order',
  })
  entityType: string;

  @ApiPropertyOptional({
    example: '8fcb43d0-f4cb-41d3-b5b3-cd9c53f8d001',
  })
  entityId?: string | null;

  @ApiProperty({
    example: 'Order created successfully.',
  })
  description: string;

  @ApiProperty({
    enum: AuditSeverity,
    example: AuditSeverity.INFO,
  })
  severity: AuditSeverity;

  @ApiPropertyOptional({
    example: '192.168.1.100',
  })
  ipAddress?: string | null;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  })
  userAgent?: string | null;

  @ApiPropertyOptional({
    example: 'req_123456789',
  })
  requestId?: string | null;

  @ApiPropertyOptional({
    example: 'corr_123456789',
  })
  correlationId?: string | null;

  @ApiPropertyOptional({
    example: {
      module: 'Order',
      operation: 'Create',
    },
  })
  metadata?: Record<string, unknown> | null;

  @ApiProperty({
    example: '2026-07-26T15:30:45.123Z',
  })
  createdAt: Date;
}