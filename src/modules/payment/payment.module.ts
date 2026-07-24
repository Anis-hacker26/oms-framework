import { Module } from '@nestjs/common';

import { PaymentController } from './controllers/payment.controller';
import { PaymentMapper } from './mappers/payment.mapper';
import { PaymentRepository } from './repositories/payment.repository';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';
import { PaymentService } from './services/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentMapper,
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
