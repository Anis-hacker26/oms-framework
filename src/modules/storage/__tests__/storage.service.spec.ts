import { StorageService } from '../services/storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const storage = {
    upload: jest.fn(),
    download: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    getUrl: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new StorageService(storage);
  });

  it('should delegate upload to the storage provider', async () => {
    const input = {
      key: 'documents/test.txt',
      filename: 'test.txt',
      content: Buffer.from('hello'),
      contentType: 'text/plain',
    };

    const result = {
      key: 'documents/test.txt',
      filename: 'test.txt',
      contentType: 'text/plain',
      size: 5,
    };

    storage.upload.mockResolvedValue(result);

    await expect(
      service.upload(input),
    ).resolves.toEqual(result);

    expect(
      storage.upload,
    ).toHaveBeenCalledWith(input);
  });

  it('should delegate download to the storage provider', async () => {
    const content = Buffer.from('hello');

    storage.download.mockResolvedValue(content);

    await expect(
      service.download('documents/test.txt'),
    ).resolves.toEqual(content);

    expect(
      storage.download,
    ).toHaveBeenCalledWith(
      'documents/test.txt',
    );
  });

  it('should delegate delete to the storage provider', async () => {
    storage.delete.mockResolvedValue(undefined);

    await service.delete(
      'documents/test.txt',
    );

    expect(
      storage.delete,
    ).toHaveBeenCalledWith(
      'documents/test.txt',
    );
  });

  it('should delegate exists to the storage provider', async () => {
    storage.exists.mockResolvedValue(true);

    await expect(
      service.exists('documents/test.txt'),
    ).resolves.toBe(true);

    expect(
      storage.exists,
    ).toHaveBeenCalledWith(
      'documents/test.txt',
    );
  });

  it('should delegate getUrl to the storage provider', async () => {
    storage.getUrl.mockResolvedValue(
      '/storage/documents%2Ftest.txt',
    );

    await expect(
      service.getUrl(
        'documents/test.txt',
      ),
    ).resolves.toBe(
      '/storage/documents%2Ftest.txt',
    );

    expect(
      storage.getUrl,
    ).toHaveBeenCalledWith(
      'documents/test.txt',
    );
  });
});