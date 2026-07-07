export const TENANT_SORTABLE_FIELDS = [
  'id',
  'name',
  'slug',
  'contactEmail',
  'createdAt',
  'updatedAt',
] as const;

export type TenantSortableField = (typeof TENANT_SORTABLE_FIELDS)[number];
