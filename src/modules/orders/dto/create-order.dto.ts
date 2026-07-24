import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
