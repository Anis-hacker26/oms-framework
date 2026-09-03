import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { STORAGE } from '../constants/storage.constants';
import { LocalStorageProvider } from '../providers/local-storage.provider';
import { StorageModule } from '../storage.module';
import { StorageService } from '../services/storage.service';

describe('StorageModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    process.env.DATABASE_URL =
      'postgresql://test:test@localhost:5432/test';

    process.env.JWT_ACCESS_SECRET =
      'test-access-secret';

    process.env.JWT_ACCESS_EXPIRES_IN =
      '15m';

    process.env.JWT_REFRESH_SECRET =
      'test-refresh-secret';

    process.env.JWT_REFRESH_EXPIRES_IN =
      '7d';

    process.env.STORAGE_LOCAL_ROOT =
      './storage-test';

    module =
      await Test.createTestingModule({
        imports: [
          StorageModule,
        ],
      }).compile();
  });

  afterEach(async () => {
    await module.close();

    delete process.env.DATABASE_URL;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_ACCESS_EXPIRES_IN;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
    delete process.env.STORAGE_LOCAL_ROOT;
  });

  it('should provide StorageService', () => {
    const service =
      module.get<StorageService>(
        StorageService,
      );

    expect(service).toBeInstanceOf(
      StorageService,
    );
  });

  it('should bind the STORAGE token to LocalStorageProvider', () => {
    const storage =
      module.get(STORAGE);

    const provider =
      module.get<LocalStorageProvider>(
        LocalStorageProvider,
      );

    expect(storage).toBe(provider);
  });
});