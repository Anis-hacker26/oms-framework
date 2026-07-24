export interface AccessTokenPayload {
  sub: string;
  tenantId: string;
  email: string;
  type: 'access';
}
