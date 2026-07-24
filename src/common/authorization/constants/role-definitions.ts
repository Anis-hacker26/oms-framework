/**
 * Built-in system role definitions.
 *
 * These roles are seeded during application setup
 * and cannot be modified by tenant administrators.
 */

export const ROLE_DEFINITIONS = [
  {
    name: 'SUPER_ADMIN',
    description: 'Full access to all system resources.',
    isSystem: true,
  },
  {
    name: 'TENANT_ADMIN',
    description: 'Full administrative access within a tenant.',
    isSystem: true,
  },
] as const;
