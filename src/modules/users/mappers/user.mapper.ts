import { UserResponseDto } from '../dto/user-response.dto';
import { UserRecord } from '../interfaces/user.repository';

export class UserMapper {
  private constructor() {}

  // =========================================
  // Public Methods
  // =========================================

  static toResponse(user: UserRecord): UserResponseDto {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
