import { Permission } from '../enums/permission.enum';

/**
 * Centralized permission definitions.
 *
 * This file is the single source of truth for
 * permission names and descriptions used by:
 *
 * - Database seeders
 * - Default role definitions
 * - Documentation
 * - Future admin UI
 */

export const PERMISSION_DEFINITIONS = {
  tenant: [
    {
      name: Permission.TENANT_CREATE,
      description: 'Create tenants',
    },
    {
      name: Permission.TENANT_READ,
      description: 'View tenant information',
    },
    {
      name: Permission.TENANT_UPDATE,
      description: 'Update tenant information',
    },
    {
      name: Permission.TENANT_SUSPEND,
      description: 'Suspend tenants',
    },
    {
      name: Permission.TENANT_ACTIVATE,
      description: 'Activate tenants',
    },
  ],

  user: [
    {
      name: Permission.USER_CREATE,
      description: 'Create users',
    },
    {
      name: Permission.USER_READ,
      description: 'View users',
    },
    {
      name: Permission.USER_UPDATE,
      description: 'Update users',
    },
    {
      name: Permission.USER_SUSPEND,
      description: 'Suspend users',
    },
    {
      name: Permission.USER_ACTIVATE,
      description: 'Activate users',
    },
  ],

  role: [
    {
      name: Permission.ROLE_CREATE,
      description: 'Create roles',
    },
    {
      name: Permission.ROLE_READ,
      description: 'View roles',
    },
    {
      name: Permission.ROLE_UPDATE,
      description: 'Update roles',
    },
    {
      name: Permission.ROLE_DELETE,
      description: 'Delete roles',
    },
    {
      name: Permission.ROLE_ASSIGN,
      description: 'Assign roles to users',
    },
    {
      name: Permission.ROLE_UNASSIGN,
      description: 'Remove roles from users',
    },
  ],

  rolePermission: [
    {
      name: Permission.ROLE_PERMISSION_ASSIGN,
      description: 'Assign permissions to roles',
    },
    {
      name: Permission.ROLE_PERMISSION_REMOVE,
      description: 'Remove permissions from roles',
    },
  ],

  order: [
    {
      name: Permission.ORDER_CREATE,
      description: 'Create orders',
    },
    {
      name: Permission.ORDER_READ,
      description: 'View orders',
    },
    {
      name: Permission.ORDER_UPDATE,
      description: 'Update orders',
    },
    {
      name: Permission.ORDER_DELETE,
      description: 'Delete orders',
    },
    {
      name: Permission.ORDER_APPROVE,
      description: 'Approve orders',
    },
    {
      name: Permission.ORDER_CANCEL,
      description: 'Cancel orders',
    },
  ],

  payment: [
    {
      name: Permission.PAYMENT_CREATE,
      description: 'Create payments',
    },
    {
      name: Permission.PAYMENT_READ,
      description: 'View payments',
    },
    {
      name: Permission.PAYMENT_REFUND,
      description: 'Refund payments',
    },
    {
      name: Permission.PAYMENT_UPDATE,
      description: 'Update payments.',
    },
    {
      name: Permission.PAYMENT_DELETE,
      description: 'Delete payments.',
    },
  ],

  notification: [
    {
      name: Permission.NOTIFICATION_SEND,
      description: 'Send notifications',
    },
    {
      name: Permission.NOTIFICATION_READ,
      description: 'View notifications',
    },
  ],

  audit: [
    {
      name: Permission.AUDIT_READ,
      description: 'View audit logs',
    },
  ],
} as const;
