import { PrometheusMetricsProvider } from '../providers/prometheus-metrics.provider';

describe('PrometheusMetricsProvider', () => {
  let provider: PrometheusMetricsProvider;

  beforeEach(() => {
    provider = new PrometheusMetricsProvider();
  });

  it('should record HTTP request metrics', async () => {
    provider.incrementHttpRequest({
      method: 'GET',
      route: '/health',
      statusCode: 200,
    });

    const metrics = await provider.getMetrics();

    expect(metrics).toContain('http_requests_total');
    expect(metrics).toContain(
      'method="GET"',
    );
    expect(metrics).toContain(
      'route="/health"',
    );
    expect(metrics).toContain(
      'status_code="200"',
    );
  });

  it('should record HTTP error metrics', async () => {
    provider.incrementHttpError({
      method: 'GET',
      route: '/orders/:id',
      statusCode: 404,
    });

    const metrics = await provider.getMetrics();

    expect(metrics).toContain('http_errors_total');
    expect(metrics).toContain(
      'method="GET"',
    );
    expect(metrics).toContain(
      'route="/orders/:id"',
    );
    expect(metrics).toContain(
      'status_code="404"',
    );
  });

  it('should record HTTP request duration', async () => {
    provider.observeHttpRequestDuration(125, {
      method: 'POST',
      route: '/orders',
      statusCode: 201,
    });

    const metrics = await provider.getMetrics();

    expect(metrics).toContain(
      'http_request_duration_ms',
    );
    expect(metrics).toContain(
      'method="POST"',
    );
    expect(metrics).toContain(
      'route="/orders"',
    );
    expect(metrics).toContain(
      'status_code="201"',
    );
  });
});