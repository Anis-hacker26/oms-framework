import { Global, Module } from '@nestjs/common';

import { LoggerModule } from './logging/logger.module';

@Global()
@Module({
  imports: [LoggerModule],
  exports: [LoggerModule],
})
export class CommonModule {}
