export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  status: 'ACTIVE' | 'SUSPENDED';
  tenant: {
    id: string;
    isActive: boolean;
    isSuspended: boolean;
  };
}