import { Global, Module } from '@nestjs/common';

import { LoggerModule } from '../../common/logging';
import { METRICS } from './constants/observability.constants';
import { MetricsController } from './controllers';
import {
  HttpMetricsInterceptor,
  HttpLoggingInterceptor,
  RequestContextInterceptor,
} from './interceptors';
import { OpenTelemetryProvider } from './providers/opentelemetry.provider';
import { PrometheusMetricsProvider } from './providers/prometheus-metrics.provider';
import { RequestContextService } from './services';

@Global()
@Module({
  imports: [LoggerModule],
  controllers: [MetricsController],
  providers: [
    RequestContextService,
    RequestContextInterceptor,
    HttpMetricsInterceptor,
    HttpLoggingInterceptor,
    PrometheusMetricsProvider,
    OpenTelemetryProvider,
    {
      provide: METRICS,
      useExisting: PrometheusMetricsProvider,
    },
  ],
  exports: [
    RequestContextService,
    RequestContextInterceptor,
    HttpMetricsInterceptor,
    HttpLoggingInterceptor,
    PrometheusMetricsProvider,
    OpenTelemetryProvider,
    METRICS,
  ],
})
export class ObservabilityModule {}