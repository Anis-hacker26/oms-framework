import { Permission } from '../enums/permission.enum';

export const SYSTEM_ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(Permission),

  TENANT_ADMIN: [
    // Tenant
    Permission.TENANT_READ,
    Permission.TENANT_UPDATE,
    Permission.TENANT_SUSPEND,
    Permission.TENANT_ACTIVATE,

    // Users
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_SUSPEND,
    Permission.USER_ACTIVATE,

    // Roles
    Permission.ROLE_CREATE,
    Permission.ROLE_READ,
    Permission.ROLE_UPDATE,
    Permission.ROLE_DELETE,
    Permission.ROLE_ASSIGN,
    Permission.ROLE_UNASSIGN,

    // Role Permissions
    Permission.ROLE_PERMISSION_ASSIGN,
    Permission.ROLE_PERMISSION_REMOVE,

    // Orders
    Permission.ORDER_CREATE,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.ORDER_DELETE,
    Permission.ORDER_APPROVE,
    Permission.ORDER_CANCEL,

    // Payments
    Permission.PAYMENT_CREATE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_DELETE,
    Permission.PAYMENT_REFUND,

    // Notifications
    Permission.NOTIFICATION_SEND,
    Permission.NOTIFICATION_READ,

    // Audit
    Permission.AUDIT_READ,
  ],
} as const;
