import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  paymentReference: string;

  @ApiProperty()
  provider: string;

  @ApiProperty({
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @ApiProperty()
  currency: string;

  @ApiProperty({
    example: 1499.99,
  })
  amount: number;

  @ApiProperty({
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @ApiProperty({
    required: false,
  })
  gatewayTransactionId?: string | null;

  @ApiProperty({
    required: false,
  })
  failureReason?: string | null;

  @ApiProperty({
    required: false,
    type: Object,
  })
  metadata?: Record<string, unknown> | null;

  @ApiProperty()
  createdById: string;

  @ApiProperty({
    required: false,
  })
  updatedById?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
