import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuditMessages } from '../constants/audit.messages';

import { CreateAuditDto } from '../dto/create-audit.dto';
import { AuditQueryDto } from '../dto/audit-query.dto';

import { AuditService } from '../services/audit.service';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create audit log',
  })
  @ApiResponse({
    status: 201,
    description: AuditMessages.AUDIT_CREATED,
  })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateAuditDto,
  ) {
    const audit = await this.auditService.create(dto);

    return {
      success: true,
      message: AuditMessages.AUDIT_CREATED,
      data: audit,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get audit log by ID',
  })
  @ApiResponse({
    status: 200,
    description: AuditMessages.AUDIT_FOUND,
  })
  async findById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    const audit = await this.auditService.findById(id);

    return {
      success: true,
      message: AuditMessages.AUDIT_FOUND,
      data: audit,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'List audit logs',
  })
  @ApiResponse({
    status: 200,
    description: AuditMessages.AUDIT_LISTED,
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: AuditQueryDto,
  ) {
    const result = await this.auditService.findAll(query);

    return {
      success: true,
      message: AuditMessages.AUDIT_LISTED,
      data: result,
    };
  }
}