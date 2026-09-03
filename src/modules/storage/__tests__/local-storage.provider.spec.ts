import {
  mkdtemp,
  readFile,
  rm,
} from 'node:fs/promises';
import {
  tmpdir,
} from 'node:os';
import {
  join,
} from 'node:path';

import {
  AppConfigService,
} from '../../config/services/app-config.service';

import { LocalStorageProvider } from '../providers/local-storage.provider';

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider;
  let testDirectory: string;

beforeEach(async () => {
  testDirectory = await mkdtemp(
    join(
      tmpdir(),
      'oms-storage-test-',
    ),
  );

  const configService = {
    storage: {
      localRoot: testDirectory,
    },
  } as AppConfigService;

  provider =
    new LocalStorageProvider(
      configService,
    );
});

afterEach(async () => {
  await rm(
    testDirectory,
    {
      recursive: true,
      force: true,
    },
  );
});

  it('should upload a file', async () => {
    const content =
      Buffer.from('Hello OMS');

    const result =
      await provider.upload({
        key: 'documents/test.txt',
        filename: 'test.txt',
        content,
        contentType: 'text/plain',
      });

    expect(result).toEqual({
      key: 'documents/test.txt',
      filename: 'test.txt',
      contentType: 'text/plain',
      size: content.length,
    });

    const storedContent =
      await readFile(
        join(
          testDirectory,
          'documents',
          'test.txt',
        ),
      );

    expect(storedContent).toEqual(content);
  });

  it('should download an uploaded file', async () => {
    const content =
      Buffer.from('Download test');

    await provider.upload({
      key: 'files/test.txt',
      filename: 'test.txt',
      content,
      contentType: 'text/plain',
    });

    await expect(
      provider.download(
        'files/test.txt',
      ),
    ).resolves.toEqual(content);
  });

  it('should report whether a file exists', async () => {
    const key = 'files/exists.txt';

    await expect(
      provider.exists(key),
    ).resolves.toBe(false);

    await provider.upload({
      key,
      filename: 'exists.txt',
      content: Buffer.from('exists'),
      contentType: 'text/plain',
    });

    await expect(
      provider.exists(key),
    ).resolves.toBe(true);
  });

  it('should delete an uploaded file', async () => {
    const key = 'files/delete.txt';

    await provider.upload({
      key,
      filename: 'delete.txt',
      content: Buffer.from('delete'),
      contentType: 'text/plain',
    });

    await provider.delete(key);

    await expect(
      provider.exists(key),
    ).resolves.toBe(false);
  });

  it('should safely ignore deleting a missing file', async () => {
    await expect(
      provider.delete(
        'files/missing.txt',
      ),
    ).resolves.toBeUndefined();
  });

  it('should generate a storage URL', async () => {
    await expect(
      provider.getUrl(
        'documents/test file.txt',
      ),
    ).resolves.toBe(
      '/storage/documents%2Ftest%20file.txt',
    );
  });

  it('should reject path traversal attempts', async () => {
    await expect(
      provider.upload({
        key: '../../outside.txt',
        filename: 'outside.txt',
        content: Buffer.from('blocked'),
        contentType: 'text/plain',
      }),
    ).rejects.toThrow(
      'Invalid storage key',
    );
  });

  it('should reject traversal attempts during download', async () => {
    await expect(
      provider.download(
        '../../outside.txt',
      ),
    ).rejects.toThrow(
      'Invalid storage key',
    );
  });

  it('should reject traversal attempts during delete', async () => {
    await expect(
      provider.delete(
        '../../outside.txt',
      ),
    ).rejects.toThrow(
      'Invalid storage key',
    );
  });

  it('should reject traversal attempts during exists', async () => {
    await expect(
      provider.exists(
        '../../outside.txt',
      ),
    ).rejects.toThrow(
      'Invalid storage key',
    );
  });

  it('should reject traversal attempts during URL generation', async () => {
    await expect(
      provider.getUrl(
        '../../outside.txt',
      ),
    ).rejects.toThrow(
      'Invalid storage key',
    );
  });
});