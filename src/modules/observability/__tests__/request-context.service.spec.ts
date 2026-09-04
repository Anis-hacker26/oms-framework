import { RequestContextService } from '../services/request-context.service';

describe('RequestContextService', () => {
  let service: RequestContextService;

  beforeEach(() => {
    service = new RequestContextService();
  });

  it('should return undefined when no context exists', () => {
    expect(service.get()).toBeUndefined();
    expect(service.getCorrelationId()).toBeUndefined();
  });

  it('should store and retrieve request context', () => {
    service.run(
      { correlationId: 'test-correlation-id' },
      () => {
        expect(service.get()).toEqual({
          correlationId: 'test-correlation-id',
        });

        expect(service.getCorrelationId()).toBe(
          'test-correlation-id',
        );
      },
    );
  });

  it('should isolate nested request contexts', () => {
    service.run(
      { correlationId: 'outer-request' },
      () => {
        expect(service.getCorrelationId()).toBe(
          'outer-request',
        );

        service.run(
          { correlationId: 'inner-request' },
          () => {
            expect(service.getCorrelationId()).toBe(
              'inner-request',
            );
          },
        );

        expect(service.getCorrelationId()).toBe(
          'outer-request',
        );
      },
    );
  });
});