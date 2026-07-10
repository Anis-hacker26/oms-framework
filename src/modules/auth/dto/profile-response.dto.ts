import { ApiProperty } from '@nestjs/swagger';

class TenantProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isSuspended: boolean;
}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    enum: ['ACTIVE', 'SUSPENDED'],
  })
  status: string;

  @ApiProperty({
    type: TenantProfileDto,
  })
  tenant: TenantProfileDto;
}