import { Test, TestingModule } from '@nestjs/testing';

import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;

  const mockNotificationService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    markAsRead: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});