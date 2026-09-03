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
    module =
      await Test.createTestingModule({
        imports: [StorageModule],
      }).compile();
  });

  afterEach(async () => {
    await module.close();
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