import { ApiProperty } from '@nestjs/swagger';

export class TenantResponseDto {
  @ApiProperty({
    example: '967d397e-fe36-4d3b-9799-a11ec58c6e9d',
  })
  id: string;

  @ApiProperty({
    example: 'Netflix',
  })
  name: string;

  @ApiProperty({
    example: 'netflix',
  })
  slug: string;

  @ApiProperty({
    example: 'admin@netflix.com',
  })
  contactEmail: string;

  @ApiProperty({
    example: false,
    description: 'Whether the tenant is suspended.',
  })
  isSuspended: boolean;

  @ApiProperty({
    example: '2026-07-07T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-07-07T12:00:00.000Z',
  })
  updatedAt: Date;
}
