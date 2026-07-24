import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: '2e0d0f54-f13c-4c7c-9a4d-84d72c99b001',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    example: 'PAY-20260720-0001',
  })
  @IsString()
  @Length(1, 100)
  paymentReference: string;

  @ApiProperty({
    example: 'Stripe',
  })
  @IsString()
  @Length(1, 100)
  provider: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    example: 'INR',
  })
  @IsString()
  @Length(3, 10)
  currency: string;

  @ApiProperty({
    example: 1499.99,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  amount: number;

  @ApiProperty({
    required: false,
    example: 'txn_123456789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  gatewayTransactionId?: string;

  @ApiProperty({
    required: false,
    example: {
      source: 'checkout',
      device: 'mobile',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
