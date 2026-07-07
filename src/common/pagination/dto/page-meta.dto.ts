export class PageMetaDto {
  readonly page: number;

  readonly limit: number;

  readonly totalItems: number;

  readonly totalPages: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor(page: number, limit: number, totalItems: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;

    this.totalPages = Math.ceil(totalItems / limit);

    this.hasPreviousPage = page > 1;

    this.hasNextPage = page < this.totalPages;
  }
}
