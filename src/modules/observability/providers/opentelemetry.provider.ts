import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';

import {
  shutdownTracing,
} from '../tracing/tracing.bootstrap';

@Injectable()
export class OpenTelemetryProvider
  implements OnModuleDestroy
{
  async onModuleDestroy(): Promise<void> {
    await shutdownTracing();
  }
}