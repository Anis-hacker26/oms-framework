/**
 * Enterprise OMS Framework
 * -----------------------------------------
 * Permission Enum
 *
 * Canonical list of all permissions used throughout
 * the application.
 *
 * Naming Convention:
 * resource:action
 *
 * Examples:
 * user:create
 * tenant:read
 * order:update
 *
 * These values are persisted in the database and
 * should never be changed once released.
 */

export enum Permission {
  // ---------------------------------------------------------------------------
  // Tenant Permissions
  // ---------------------------------------------------------------------------
  TENANT_CREATE = 'tenant:create',
  TENANT_READ = 'tenant:read',
  TENANT_UPDATE = 'tenant:update',
  TENANT_SUSPEND = 'tenant:suspend',
  TENANT_ACTIVATE = 'tenant:activate',

  // ---------------------------------------------------------------------------
  // User Permissions
  // ---------------------------------------------------------------------------
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_SUSPEND = 'user:suspend',
  USER_ACTIVATE = 'user:activate',

  // ---------------------------------------------------------------------------
  // Role Permissions
  // ---------------------------------------------------------------------------
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',

  // ---------------------------------------------------------------------------
  // Permission Management
  // ---------------------------------------------------------------------------
 // User Role Management
ROLE_ASSIGN = 'role:assign',
ROLE_UNASSIGN = 'role:unassign',

// Role Permission Management
ROLE_PERMISSION_ASSIGN = 'role-permission:assign',
ROLE_PERMISSION_REMOVE = 'role-permission:remove',

  // ---------------------------------------------------------------------------
  // Order Permissions
  // ---------------------------------------------------------------------------
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  ORDER_DELETE = 'order:delete',
  ORDER_APPROVE = 'order:approve',
  ORDER_CANCEL = 'order:cancel',

  // ---------------------------------------------------------------------------
  // Payment Permissions
  // ---------------------------------------------------------------------------
  PAYMENT_CREATE = 'payment:create',
  PAYMENT_READ = 'payment:read',
  PAYMENT_REFUND = 'payment:refund',

  // ---------------------------------------------------------------------------
  // Notification Permissions
  // ---------------------------------------------------------------------------
  NOTIFICATION_SEND = 'notification:send',
  NOTIFICATION_READ = 'notification:read',

  // ---------------------------------------------------------------------------
  // Audit Permissions
  // ---------------------------------------------------------------------------
  AUDIT_READ = 'audit:read',
}