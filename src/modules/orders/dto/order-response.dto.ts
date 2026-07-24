import { ApiProperty } from '@nestjs/swagger';

import { OrderStatus } from '@prisma/client';

export class OrderResponseDto {
  @ApiProperty({
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  id: string;

  @ApiProperty({
    example: 'f91b60ef-54f7-4f65-ae48-6bb0d5d51d76',
  })
  tenantId: string;

  @ApiProperty({
    example: 'ORD-202607190001',
  })
  orderNumber: string;

  @ApiProperty({
    example: 'Laptop Purchase',
  })
  title: string;

  @ApiProperty({
    example: 'Purchase order for office laptops.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
