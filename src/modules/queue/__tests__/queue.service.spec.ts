import { Test, TestingModule } from '@nestjs/testing';

import { QUEUE_PROVIDER } from '../constants/queue.tokens';
import type { QueueProvider } from '../interfaces/queue-provider.interface';
import type { QueueJob } from '../interfaces/queue-job.interface';
import { QueueService } from '../services/queue.service';

describe('QueueService', () => {
  let service: QueueService;

  const mockQueueProvider: jest.Mocked<QueueProvider> = {
    enqueue: jest.fn(),
    enqueueBulk: jest.fn(),
    getJob: jest.fn(),
    remove: jest.fn(),
    retry: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    clean: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: QUEUE_PROVIDER,
          useValue: mockQueueProvider,
        },
      ],
    }).compile();

    service = module.get(QueueService);
  });

  describe('enqueue', () => {
    it('should delegate enqueue to QueueProvider', async () => {
     const job: QueueJob<{ email: string }> = {
  queue: 'emails',
  name: 'send-email',
  payload: {
    email: 'test@example.com',
  },
};

      mockQueueProvider.enqueue.mockResolvedValue('job-1');

      const result = await service.enqueue(job);

      expect(result).toBe('job-1');
      expect(mockQueueProvider.enqueue).toHaveBeenCalledWith(job);
    });
  });

  describe('enqueueBulk', () => {
    it('should delegate enqueueBulk to QueueProvider', async () => {
      const jobs: QueueJob[] = [];

      mockQueueProvider.enqueueBulk.mockResolvedValue(['1', '2']);

      const result = await service.enqueueBulk(jobs);

      expect(result).toEqual(['1', '2']);
      expect(mockQueueProvider.enqueueBulk).toHaveBeenCalledWith(jobs);
    });
  });

  describe('getJob', () => {
    it('should delegate getJob to QueueProvider', async () => {
      mockQueueProvider.getJob.mockResolvedValue(null);

      const result = await service.getJob('emails', '1');

      expect(result).toBeNull();
      expect(mockQueueProvider.getJob).toHaveBeenCalledWith('emails', '1');
    });
  });

  describe('remove', () => {
    it('should delegate remove to QueueProvider', async () => {
      mockQueueProvider.remove.mockResolvedValue();

      await service.remove('emails', '1');

      expect(mockQueueProvider.remove).toHaveBeenCalledWith('emails', '1');
    });
  });

  describe('retry', () => {
    it('should delegate retry to QueueProvider', async () => {
      mockQueueProvider.retry.mockResolvedValue();

      await service.retry('emails', '1');

      expect(mockQueueProvider.retry).toHaveBeenCalledWith('emails', '1');
    });
  });

  describe('pause', () => {
    it('should delegate pause to QueueProvider', async () => {
      mockQueueProvider.pause.mockResolvedValue();

      await service.pause('emails');

      expect(mockQueueProvider.pause).toHaveBeenCalledWith('emails');
    });
  });

  describe('resume', () => {
    it('should delegate resume to QueueProvider', async () => {
      mockQueueProvider.resume.mockResolvedValue();

      await service.resume('emails');

      expect(mockQueueProvider.resume).toHaveBeenCalledWith('emails');
    });
  });

  describe('clean', () => {
    it('should delegate clean to QueueProvider', async () => {
      mockQueueProvider.clean.mockResolvedValue();

      await service.clean('emails');

      expect(mockQueueProvider.clean).toHaveBeenCalledWith('emails');
    });
  });
});