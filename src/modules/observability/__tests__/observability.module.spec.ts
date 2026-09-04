import { Test } from '@nestjs/testing';

import { RequestContextInterceptor } from '../interceptors';
import { ObservabilityModule } from '../observability.module';
import { RequestContextService } from '../services';

describe('ObservabilityModule', () => {
  it('should provide request context infrastructure', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ObservabilityModule],
    }).compile();

    expect(
      moduleRef.get(RequestContextService),
    ).toBeInstanceOf(RequestContextService);

    expect(
      moduleRef.get(RequestContextInterceptor),
    ).toBeInstanceOf(RequestContextInterceptor);
  });
});