import { Permission } from '../enums/permission.enum';

/**
 * Permission Groups
 *
 * Groups permissions by domain to provide
 * cleaner imports and improve readability
 * throughout the application.
 */

export const TenantPermissions = {
  CREATE: Permission.TENANT_CREATE,
  READ: Permission.TENANT_READ,
  UPDATE: Permission.TENANT_UPDATE,
  SUSPEND: Permission.TENANT_SUSPEND,
  ACTIVATE: Permission.TENANT_ACTIVATE,
} as const;

export const UserPermissions = {
  CREATE: Permission.USER_CREATE,
  READ: Permission.USER_READ,
  UPDATE: Permission.USER_UPDATE,
  SUSPEND: Permission.USER_SUSPEND,
  ACTIVATE: Permission.USER_ACTIVATE,
} as const;

export const RolePermissions = {
  CREATE: Permission.ROLE_CREATE,
  READ: Permission.ROLE_READ,
  UPDATE: Permission.ROLE_UPDATE,
  DELETE: Permission.ROLE_DELETE,
} as const;

export const UserRolePermissions = {
  ASSIGN: Permission.ROLE_ASSIGN,
  UNASSIGN: Permission.ROLE_UNASSIGN,
} as const;

export const RolePermissionManagementPermissions = {
  ASSIGN: Permission.ROLE_PERMISSION_ASSIGN,
  REMOVE: Permission.ROLE_PERMISSION_REMOVE,
} as const;

export const OrderPermissions = {
  CREATE: Permission.ORDER_CREATE,
  READ: Permission.ORDER_READ,
  UPDATE: Permission.ORDER_UPDATE,
  DELETE: Permission.ORDER_DELETE,
  APPROVE: Permission.ORDER_APPROVE,
  CANCEL: Permission.ORDER_CANCEL,
} as const;

export const PaymentPermissions = {
  CREATE: Permission.PAYMENT_CREATE,
  READ: Permission.PAYMENT_READ,
  REFUND: Permission.PAYMENT_REFUND,
} as const;

export const NotificationPermissions = {
  SEND: Permission.NOTIFICATION_SEND,
  READ: Permission.NOTIFICATION_READ,
} as const;

export const AuditPermissions = {
  READ: Permission.AUDIT_READ,
} as const;