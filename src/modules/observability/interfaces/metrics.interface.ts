export interface HttpMetricLabels {
  readonly method: string;
  readonly route: string;
  readonly statusCode: number;
}

export interface Metrics {
  incrementHttpRequest(labels: HttpMetricLabels): void;

  incrementHttpError(labels: HttpMetricLabels): void;

  observeHttpRequestDuration(
    durationMs: number,
    labels: HttpMetricLabels,
  ): void;
}