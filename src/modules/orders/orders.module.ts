import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

import { OrderRepository } from './repositories/order.repository';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';

@Module({
  imports: [PrismaModule],

  controllers: [OrdersController],

  providers: [
    OrdersService,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],

  exports: [OrdersService, OrderRepository],
})
export class OrdersModule {}
