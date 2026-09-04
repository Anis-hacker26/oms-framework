import {
  Controller,
  Get,
  Header,
  Inject,
} from '@nestjs/common';

import { METRICS } from '../constants/observability.constants';
import { PrometheusMetricsProvider } from '../providers/prometheus-metrics.provider';

@Controller('metrics')
export class MetricsController {
  constructor(
    @Inject(METRICS)
    private readonly metrics: PrometheusMetricsProvider,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async getMetrics(): Promise<string> {
    return this.metrics.getMetrics();
  }
}