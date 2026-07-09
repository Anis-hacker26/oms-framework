import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTenantDto {
  @ApiPropertyOptional({
    example: 'Google',
    description: 'Tenant name.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'google',
    description: 'Unique tenant slug.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug may contain lowercase letters, numbers and hyphens only.',
  })
  slug?: string;

  @ApiPropertyOptional({
    example: 'admin@google.com',
    description: 'Tenant contact email.',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;
}
