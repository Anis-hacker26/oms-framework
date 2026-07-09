export const AUTH_STRATEGY = 'jwt';

export const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export const AUTH_HEADER_PREFIX = 'Bearer';

export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const;