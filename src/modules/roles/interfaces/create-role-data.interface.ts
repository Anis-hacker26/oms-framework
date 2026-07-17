export interface CreateRoleData {
  tenantId: string | null;
  name: string;
  description?: string | null;
  isSystem?: boolean;
}