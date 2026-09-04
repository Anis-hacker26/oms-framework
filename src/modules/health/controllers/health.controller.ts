import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { HEALTH_STATUS } from '../constants/health.constants';
import type { HealthResponse } from '../interfaces/health-response.interface';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) {}

  @Get()
  async getHealth(): Promise<HealthResponse> {
    const response =
      await this.healthService.getHealth();

    this.throwIfUnhealthy(response);

    return response;
  }

  @Get('live')
  getLiveness(): HealthResponse {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  async getReadiness(): Promise<HealthResponse> {
    const response =
      await this.healthService.getReadiness();

    this.throwIfUnhealthy(response);

    return response;
  }

  private throwIfUnhealthy(
    response: HealthResponse,
  ): void {
    if (response.status === HEALTH_STATUS.DOWN) {
      throw new HttpException(
        response,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
