export interface StorageFile {
  readonly key: string;
  readonly filename: string;
  readonly contentType: string;
  readonly size: number;
}

export interface UploadFileInput {
  readonly key: string;
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType: string;
}

export interface Storage {
  upload(
    input: UploadFileInput,
  ): Promise<StorageFile>;

  download(
    key: string,
  ): Promise<Buffer>;

  delete(
    key: string,
  ): Promise<void>;

  exists(
    key: string,
  ): Promise<boolean>;

  getUrl(
    key: string,
  ): Promise<string>;
}