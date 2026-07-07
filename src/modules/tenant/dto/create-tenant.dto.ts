import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Unique tenant name',
    example: 'Netflix',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Unique URL-friendly tenant identifier',
    example: 'netflix',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  slug: string;

  @ApiProperty({
    description: 'Primary contact email of the tenant',
    example: 'admin@netflix.com',
  })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;
}
