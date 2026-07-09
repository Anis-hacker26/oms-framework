export const TenantMessages = {
  CREATED: 'Tenant created successfully.',

  RETRIEVED: 'Tenant retrieved successfully.',

  LIST_RETRIEVED: 'Tenants retrieved successfully.',

  UPDATED: 'Tenant updated successfully.',

  SUSPENDED: 'Tenant suspended successfully.',

  ACTIVATED: 'Tenant activated successfully.',

  NO_CHANGES: 'No changes were provided for update.',

  DUPLICATE_SLUG: 'Tenant slug already exists.',

  DUPLICATE_NAME: 'Tenant name already exists.',

  DUPLICATE_EMAIL: 'Tenant contact email already exists.',

  NOT_FOUND: 'Tenant not found.',

  INVALID_ID: 'Invalid tenant ID.',

  INVALID_SORT_FIELD: 'Invalid sort field.',

  ALREADY_SUSPENDED: 'Tenant is already suspended.',

  ALREADY_ACTIVE: 'Tenant is already active.',
} as const;
