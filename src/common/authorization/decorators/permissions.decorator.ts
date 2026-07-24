import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

/**
 * Metadata key used by the PermissionsGuard.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Declares the permissions required to access
 * a controller or route handler.
 *
 * Example:
 *
 * @Permissions(Permission.USER_CREATE)
 * @Post()
 * createUser() {}
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
