export interface RoleResponse {
  id: string;

  tenantId: string | null;

  name: string;
  description: string | null;

  isSystem: boolean;

  createdAt: Date;
  updatedAt: Date;
}
