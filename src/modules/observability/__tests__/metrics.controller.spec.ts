import { MetricsController } from '../controllers/metrics.controller';

describe('MetricsController', () => {
  it('should expose Prometheus metrics', async () => {
    const metricsProvider = {
      getMetrics: jest.fn().mockResolvedValue(
        '# HELP http_requests_total Total number of HTTP requests.',
      ),
    };

    const controller = new MetricsController(
      metricsProvider as never,
    );

    const result = await controller.getMetrics();

    expect(result).toContain('http_requests_total');
    expect(metricsProvider.getMetrics).toHaveBeenCalledTimes(1);
  });
});