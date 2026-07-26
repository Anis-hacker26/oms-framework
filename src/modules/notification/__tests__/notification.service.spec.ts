import { Test, TestingModule } from '@nestjs/testing';

import { NotificationService } from '../services/notification.service';
import { NotificationRepository } from '../repositories/notification.repository';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockNotificationRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    markAsRead: jest.fn(),
    archive: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});