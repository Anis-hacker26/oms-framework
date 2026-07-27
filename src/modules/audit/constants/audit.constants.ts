export const AUDIT_DEFAULT_PAGE = 1;

export const AUDIT_DEFAULT_LIMIT = 10;

export const AUDIT_MAX_LIMIT = 100;

export const AUDIT_DEFAULT_SORT_BY = 'createdAt';

export const AUDIT_DEFAULT_SORT_ORDER = 'desc';

export const AUDIT_SEARCHABLE_FIELDS = [
  'description',
  'entityType',
  'requestId',
  'correlationId',
];

export const AUDIT_SORTABLE_FIELDS = [
  'createdAt',
  'action',
  'severity',
];