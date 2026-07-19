import { Test, TestingModule } from '@nestjs/testing';

import { OrdersService } from '../services/orders.service';
import { OrderRepository } from '../repositories/order.repository';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrderRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByOrderNumber: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrdersService,
          {
            provide: OrderRepository,
            useValue: mockOrderRepository,
          },
        ],
      }).compile();

    service = module.get<OrdersService>(
      OrdersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});