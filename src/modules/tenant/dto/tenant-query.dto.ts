import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

import { TenantStatus } from '../enums/tenant-status.enum';

export class TenantQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: TenantStatus,
    description: 'Filter tenants by status.',
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
