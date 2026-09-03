import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { STORAGE } from '../constants/storage.constants';

import type {
  Storage,
  StorageFile,
  UploadFileInput,
} from '../interfaces/storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE)
    private readonly storage: Storage,
  ) {}

  upload(
    input: UploadFileInput,
  ): Promise<StorageFile> {
    return this.storage.upload(input);
  }

  download(
    key: string,
  ): Promise<Buffer> {
    return this.storage.download(key);
  }

  delete(
    key: string,
  ): Promise<void> {
    return this.storage.delete(key);
  }

  exists(
    key: string,
  ): Promise<boolean> {
    return this.storage.exists(key);
  }

  getUrl(
    key: string,
  ): Promise<string> {
    return this.storage.getUrl(key);
  }
}