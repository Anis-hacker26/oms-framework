import { Test, TestingModule } from '@nestjs/testing';
import {
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

import { EventService } from '../../event/services/event.service';
import { PaymentService } from '../services/payment.service';
import { PaymentRepository } from '../repositories/payment.repository';

describe('PaymentService', () => {
  let service: PaymentService;
  let eventService: jest.Mocked<EventService>;

  const mockPaymentRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByPaymentReference: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          PaymentService,
          {
            provide: PaymentRepository,
            useValue: mockPaymentRepository,
          },
          {
            provide: EventService,
            useValue: {
              publish: jest.fn(),
              subscribe: jest.fn(),
              unsubscribe: jest.fn(),
            },
          },
        ],
      }).compile();

    service =
      module.get<PaymentService>(PaymentService);

    eventService =
      module.get(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    const existingPayment = {
      id: 'payment-1',
      tenantId: 'tenant-1',
      orderId: 'order-1',
      paymentReference: 'PAY-001',
      provider: 'test-provider',
      method: PaymentMethod.UPI,
      currency: 'INR',
      amount: 1499.99,
      status: PaymentStatus.PROCESSING,
      gatewayTransactionId: null,
      failureReason: null,
      metadata: null,
      createdById: 'user-1',
      updatedById: null,
      version: 1,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const completedPayment = {
      ...existingPayment,
      status: PaymentStatus.COMPLETED,
      gatewayTransactionId: 'gateway-tx-001',
      version: 2,
    };

const user = {
  id: 'user-1',
  tenantId: 'tenant-1',
  email: 'user@example.com',
  passwordHash: 'hashed-password',
  firstName: 'Test',
  lastName: 'User',
  status: 'ACTIVE' as const,
  tenant: {
    id: 'tenant-1',
    name: 'Test Tenant',
    contactEmail: 'tenant@example.com',
    slug: 'test-tenant',
    isActive: true,
    isSuspended: false,
  },
  roles: ['USER'],
  permissions: ['payment:update'],
};

    const updatePaymentDto = {
      status: PaymentStatus.COMPLETED,
      provider: 'test-provider',
      method: PaymentMethod.UPI,
      currency: 'INR',
      amount: 1499.99,
      gatewayTransactionId: 'gateway-tx-001',
      metadata: undefined,
    };

    it('should publish PaymentSucceededEvent when payment transitions to COMPLETED', async () => {
      mockPaymentRepository.findById.mockResolvedValue(
        existingPayment,
      );

      mockPaymentRepository.update.mockResolvedValue(
        completedPayment,
      );

      const result = await service.update(
        'payment-1',
        user,
        updatePaymentDto,
      );

      expect(
        mockPaymentRepository.findById,
      ).toHaveBeenCalledWith('payment-1');

      expect(
        mockPaymentRepository.update,
      ).toHaveBeenCalledWith(
        'payment-1',
        expect.objectContaining({
          status: PaymentStatus.COMPLETED,
          updatedById: user.id,
          version: existingPayment.version + 1,
        }),
      );

      expect(
        eventService.publish,
      ).toHaveBeenCalledTimes(1);

      expect(
        eventService.publish,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: 'payment.succeeded',
          payload: {
            paymentId: completedPayment.id,
            tenantId: completedPayment.tenantId,
            orderId: completedPayment.orderId,
            paymentReference:
              completedPayment.paymentReference,
            provider: completedPayment.provider,
            method: completedPayment.method,
            currency: completedPayment.currency,
            amount: Number(
              completedPayment.amount,
            ),
            status: PaymentStatus.COMPLETED,
            gatewayTransactionId:
              completedPayment.gatewayTransactionId,
          },
          tenantId: completedPayment.tenantId,
        }),
      );

      expect(result.id).toBe(
        completedPayment.id,
      );
    });

    it('should not publish PaymentSucceededEvent when payment is already COMPLETED', async () => {
      const alreadyCompletedPayment = {
        ...existingPayment,
        status: PaymentStatus.COMPLETED,
      };

      mockPaymentRepository.findById.mockResolvedValue(
        alreadyCompletedPayment,
      );

      mockPaymentRepository.update.mockResolvedValue(
        alreadyCompletedPayment,
      );

      await service.update(
        'payment-1',
        user,
        updatePaymentDto,
      );

      expect(
        eventService.publish,
      ).not.toHaveBeenCalled();
    });
  });
});
