import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

export class UserQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: UserStatus,
    description: 'Filter users by status.',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter users by tenant UUID.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
