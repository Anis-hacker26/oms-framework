export interface AuthUser {
  id: string;

  tenantId: string;

  email: string;

  passwordHash: string;

  firstName: string;

  lastName: string | null;

  status: 'ACTIVE' | 'SUSPENDED';

  tenant: {
    id: string;

    name: string;

    contactEmail: string;

    slug: string;

    isActive: boolean;

    isSuspended: boolean;
  };
}
