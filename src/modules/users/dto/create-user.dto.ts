import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  // =========================================
  // Tenant
  // =========================================

  @ApiProperty({
    description: 'Unique identifier of the tenant that owns the user',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  tenantId: string;

  // =========================================
  // Authentication
  // =========================================

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({
    description: 'Password used to authenticate the user',
    minLength: 12,
    example: 'SecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  // =========================================
  // Profile
  // =========================================

  @ApiProperty({
    description: 'First name of the user',
    example: 'Anisha',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Prasad',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName?: string;
}
