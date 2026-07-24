import { Test, TestingModule } from '@nestjs/testing';

import { PaymentService } from '../services/payment.service';
import { PaymentRepository } from '../repositories/payment.repository';

describe('PaymentService', () => {
  let service: PaymentService;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
