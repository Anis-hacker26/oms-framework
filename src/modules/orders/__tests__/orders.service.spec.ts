import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';

import { OrdersService } from '../services/orders.service';
import { OrderRepository } from '../repositories/order.repository';
import { EventService } from '../../event/services/event.service';

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

  const mockEventService = {
    publish: jest.fn(),
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
          {
            provide: EventService,
            useValue: mockEventService,
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

  it('should publish OrderCreatedEvent after creating an order', async () => {
    const user = {
  id: 'user-123',
  tenantId: 'tenant-123',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  firstName: 'Test',
  lastName: 'User',
  status: 'ACTIVE' as const,
  tenant: {
    id: 'tenant-123',
    name: 'Test Tenant',
    contactEmail: 'tenant@example.com',
    slug: 'test-tenant',
    isActive: true,
    isSuspended: false,
  },
  roles: [],
  permissions: [],
};

    const createOrderDto = {
      title: 'Test Order',
      description: 'Test description',
      status: OrderStatus.DRAFT,
    };

    const createdOrder = {
      id: 'order-123',
      tenantId: 'tenant-123',
      orderNumber: 'ORD-123456-1234',
      title: 'Test Order',
      description: 'Test description',
      status: OrderStatus.DRAFT,
      createdById: 'user-123',
      updatedById: null,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrderRepository.create.mockResolvedValue(
      createdOrder,
    );

    mockEventService.publish.mockResolvedValue(
      undefined,
    );

    const result = await service.create(
      user,
      createOrderDto,
    );

    expect(
      mockOrderRepository.create,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockEventService.publish,
    ).toHaveBeenCalledTimes(1);

    const publishedEvent =
      mockEventService.publish.mock.calls[0][0];

    expect(publishedEvent.eventName).toBe(
      'order.created',
    );

    expect(publishedEvent.payload).toEqual({
      orderId: 'order-123',
      tenantId: 'tenant-123',
      orderNumber: 'ORD-123456-1234',
      title: 'Test Order',
      status: OrderStatus.DRAFT,
      createdById: 'user-123',
    });

    expect(publishedEvent.tenantId).toBe(
      'tenant-123',
    );

    expect(result).toEqual({
      id: 'order-123',
      tenantId: 'tenant-123',
      orderNumber: 'ORD-123456-1234',
      title: 'Test Order',
      description: 'Test description',
      status: OrderStatus.DRAFT,
      createdById: 'user-123',
      updatedById: null,
      version: 1,
      createdAt: createdOrder.createdAt,
      updatedAt: createdOrder.updatedAt,
    });
  });
});