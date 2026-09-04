import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});

export async function startTracing(): Promise<void> {
  await sdk.start();
}

export async function shutdownTracing(): Promise<void> {
  await sdk.shutdown();
}