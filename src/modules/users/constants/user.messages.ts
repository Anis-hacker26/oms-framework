export const UserMessages = {
  CREATED: 'User created successfully.',

  RETRIEVED: 'User retrieved successfully.',

  LIST_RETRIEVED: 'Users retrieved successfully.',

  UPDATED: 'User updated successfully.',

  SUSPENDED: 'User suspended successfully.',

  ACTIVATED: 'User activated successfully.',

  NO_CHANGES: 'No changes were provided for update.',

  DUPLICATE_EMAIL: 'User email already exists.',

  NOT_FOUND: 'User not found.',

  INVALID_ID: 'Invalid user ID.',

  ALREADY_SUSPENDED: 'User is already suspended.',

  ALREADY_ACTIVE: 'User is already active.',

  TENANT_NOT_FOUND: 'Tenant not found.',

  TENANT_INACTIVE: 'Cannot create a user for an inactive or suspended tenant.',

  INVALID_SORT_FIELD: 'Invalid sort field.',
} as const;
