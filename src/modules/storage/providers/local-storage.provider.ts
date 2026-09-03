import {
  Injectable,
} from '@nestjs/common';
import {
  promises as fs,
} from 'node:fs';
import {
  dirname,
  resolve,
  sep,
} from 'node:path';

import type {
  Storage,
  StorageFile,
  UploadFileInput,
} from '../interfaces/storage.interface';

import {
  AppConfigService,
} from '../../config/services/app-config.service';

@Injectable()
export class LocalStorageProvider
  implements Storage
{
  constructor(
    private readonly configService: AppConfigService,
  ) {}

  private get rootDirectory(): string {
    return resolve(
      this.configService.storage.localRoot,
    );
  }

  async upload(
    input: UploadFileInput,
  ): Promise<StorageFile> {
    const filePath =
      this.resolveSafePath(input.key);

    await fs.mkdir(
      dirname(filePath),
      {
        recursive: true,
      },
    );

    await fs.writeFile(
      filePath,
      input.content,
    );

    return {
      key: input.key,
      filename: input.filename,
      contentType: input.contentType,
      size: input.content.length,
    };
  }

  async download(
    key: string,
  ): Promise<Buffer> {
    const filePath =
      this.resolveSafePath(key);

    return fs.readFile(filePath);
  }

  async delete(
    key: string,
  ): Promise<void> {
    const filePath =
      this.resolveSafePath(key);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      const code =
        error &&
        typeof error === 'object' &&
        'code' in error
          ? error.code
          : undefined;

      if (code === 'ENOENT') {
        return;
      }

      throw error;
    }
  }

  async exists(
    key: string,
  ): Promise<boolean> {
    const filePath =
      this.resolveSafePath(key);

    try {
      await fs.access(filePath);

      return true;
    } catch {
      return false;
    }
  }

  async getUrl(
    key: string,
  ): Promise<string> {
    this.resolveSafePath(key);

    return `/storage/${encodeURIComponent(key)}`;
  }

private resolveSafePath(
  key: string,
): string {
  const root =
    resolve(this.rootDirectory);

  const filePath =
    resolve(root, key);

  if (
    filePath !== root &&
    !filePath.startsWith(
      `${root}${sep}`,
    )
  ) {
    throw new Error(
      'Invalid storage key',
    );
  }

  return filePath;
}
}