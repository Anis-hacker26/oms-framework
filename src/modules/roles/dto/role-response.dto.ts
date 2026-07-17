import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  id: string;

  @ApiProperty({
    example: 'f91b60ef-54f7-4f65-ae48-6bb0d5d51d76',
    nullable: true,
  })
  tenantId: string | null;

  @ApiProperty({
    example: 'Administrator',
  })
  name: string;

  @ApiProperty({
    example: 'System administrator role',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: true,
  })
  isSystem: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}