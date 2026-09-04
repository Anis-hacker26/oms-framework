import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  HttpLoggingInterceptor,
  HttpMetricsInterceptor,
  RequestContextInterceptor,
} from './modules/observability/interceptors';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './database/prisma/prisma.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditModule } from './modules/audit/audit.module';
import { EventModule } from './modules/event/event.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { StorageModule } from './modules/storage/storage.module';
import { ConfigModule } from './modules/config/config.module';
import { HealthModule } from './modules/health/health.module';
import { ObservabilityModule } from './modules/observability/observability.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    ObservabilityModule,
    HealthModule,
    EventModule,
    TenantModule,
    AuthModule,
    UsersModule,
    SchedulerModule,
    OrdersModule,
    PaymentModule,
    NotificationModule,
    AuditModule,
    StorageModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
  provide: APP_INTERCEPTOR,
  useClass: HttpMetricsInterceptor,
},
{
  provide: APP_INTERCEPTOR,
  useClass: HttpLoggingInterceptor,
},
  ],
})
export class AppModule {}
