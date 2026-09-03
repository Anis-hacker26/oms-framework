import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiPropertyOptional({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}