import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { STORAGE } from './constants/storage.constants';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { StorageService } from './services/storage.service';

@Module({
  imports: [
    ConfigModule,
  ],

  providers: [
    LocalStorageProvider,

    {
      provide: STORAGE,
      useExisting: LocalStorageProvider,
    },

    StorageService,
  ],

  exports: [
    StorageService,
    STORAGE,
  ],
})
export class StorageModule {}