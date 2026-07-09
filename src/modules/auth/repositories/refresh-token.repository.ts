export abstract class RefreshTokenRepository {
  abstract create(
    sessionId: string,
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;

  abstract findById(sessionId: string): Promise<unknown | null>;

  abstract revoke(sessionId: string): Promise<void>;

  abstract revokeAll(userId: string): Promise<void>;

  abstract deleteExpired(): Promise<void>;
}