import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

import { PaginationConstants } from '../constants/pagination.constants';
import { SortOrder } from '../enums/sort-order.enum';

export class PageOptionsDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number.',
    example: 1,
    default: PaginationConstants.DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = PaginationConstants.DEFAULT_PAGE;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of records per page.',
    example: 10,
    default: PaginationConstants.DEFAULT_LIMIT,
    maximum: PaginationConstants.MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(PaginationConstants.MAX_LIMIT)
  limit: number = PaginationConstants.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    type: String,
    description: 'Field used for sorting.',
    example: 'createdAt',
    default: PaginationConstants.DEFAULT_SORT_BY,
  })
  @IsOptional()
  @IsString()
  sortBy: string = PaginationConstants.DEFAULT_SORT_BY;

  @ApiPropertyOptional({
    enum: SortOrder,
    enumName: 'SortOrder',
    description: 'Sort direction.',
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    description: 'Search keyword.',
    example: 'google',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
