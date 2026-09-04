import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
} from '@prometheus-io/client';

import type { HttpMetricLabels, Metrics } from '../interfaces';

@Injectable()
export class PrometheusMetricsProvider implements Metrics {
  private readonly registry = new Registry();

  private readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });

  private readonly httpErrorsTotal = new Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });

  private readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_ms',
    help: 'HTTP request duration in milliseconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [
      5,
      10,
      25,
      50,
      100,
      250,
      500,
      1000,
      2500,
      5000,
    ],
    registers: [this.registry],
  });

  incrementHttpRequest(labels: HttpMetricLabels): void {
    this.httpRequestsTotal.inc({
      method: labels.method,
      route: labels.route,
      status_code: String(labels.statusCode),
    });
  }

  incrementHttpError(labels: HttpMetricLabels): void {
    this.httpErrorsTotal.inc({
      method: labels.method,
      route: labels.route,
      status_code: String(labels.statusCode),
    });
  }

  observeHttpRequestDuration(
    durationMs: number,
    labels: HttpMetricLabels,
  ): void {
    this.httpRequestDuration.observe(
      {
        method: labels.method,
        route: labels.route,
        status_code: String(labels.statusCode),
      },
      durationMs,
    );
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}