export const RoleMessages = {
  // Success
  ROLE_CREATED: 'Role created successfully.',
  ROLE_UPDATED: 'Role updated successfully.',
  ROLE_DELETED: 'Role deleted successfully.',

  ROLE_ASSIGNED: 'Role assigned successfully.',
  ROLE_REMOVED: 'Role removed successfully.',

  PERMISSION_ASSIGNED: 'Permission assigned successfully.',
  PERMISSION_REMOVED: 'Permission removed successfully.',

  // Errors
  ROLE_NOT_FOUND: 'Role not found.',
  ROLE_ALREADY_EXISTS: 'Role with this name already exists.',

  ROLE_ALREADY_ASSIGNED: 'Role is already assigned to the user.',
  ROLE_NOT_ASSIGNED: 'Role is not assigned to the user.',

  ROLE_RETRIEVED: 'Role retrieved successfully.',
ROLE_LIST_RETRIEVED: 'Roles retrieved successfully.',

  PERMISSION_ALREADY_ASSIGNED:
    'Permission is already assigned to the role.',
  PERMISSION_NOT_ASSIGNED:
    'Permission is not assigned to the role.',

  SYSTEM_ROLE_PROTECTED:
    'System roles cannot be modified or deleted.',

  CUSTOM_ROLE_ONLY:
    'This operation is allowed only for custom roles.',

  INVALID_PERMISSION:
    'Invalid permission.',

  INVALID_ROLE:
    'Invalid role.',
} as const;