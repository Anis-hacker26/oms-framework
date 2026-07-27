import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditSeverity } from '@prisma/client';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAuditDto {
  @ApiProperty({
    example: '2e0d0f54-f13c-4c7c-9a4d-84d72c99b001',
  })
  @IsUUID()
  tenantId: string;

  @ApiPropertyOptional({
    example: '5c57b0d2-3d0e-45a5-a548-1baf55d6d8d8',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    example: 'Order',
  })
  @IsString()
  @Length(1, 100)
  entityType: string;

  @ApiPropertyOptional({
    example: '8fcb43d0-f4cb-41d3-b5b3-cd9c53f8d001',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({
    example: 'Order created successfully.',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiPropertyOptional({
    enum: AuditSeverity,
    example: AuditSeverity.INFO,
  })
  @IsOptional()
  @IsEnum(AuditSeverity)
  severity?: AuditSeverity;

  @ApiPropertyOptional({
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  ipAddress?: string;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userAgent?: string;

  @ApiPropertyOptional({
    example: 'req_123456789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  requestId?: string;

  @ApiPropertyOptional({
    example: 'corr_123456789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  correlationId?: string;

  @ApiPropertyOptional({
    example: {
      module: 'Order',
      operation: 'Create',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}