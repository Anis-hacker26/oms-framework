import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/pagination/dto/page-options.dto';

import { OrderStatus } from '../enums/order-status.enum';

export class ListOrdersDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}