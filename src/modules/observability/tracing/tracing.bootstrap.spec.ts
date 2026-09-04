import { NodeSDK } from '@opentelemetry/sdk-node';

import {
  startTracing,
  shutdownTracing,
} from './tracing.bootstrap';

jest.mock('@opentelemetry/sdk-node', () => ({
  NodeSDK: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    shutdown: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('Tracing Bootstrap', () => {
  it('should initialize and start the OpenTelemetry SDK', async () => {
    await startTracing();

    expect(NodeSDK).toHaveBeenCalledTimes(1);

    const sdkInstance = (NodeSDK as jest.Mock).mock.results[0]
      .value;

    expect(sdkInstance.start).toHaveBeenCalledTimes(1);
  });

  it('should shut down the OpenTelemetry SDK', async () => {
    await shutdownTracing();

    const sdkInstance = (NodeSDK as jest.Mock).mock.results[0]
      .value;

    expect(sdkInstance.shutdown).toHaveBeenCalledTimes(1);
  });
});