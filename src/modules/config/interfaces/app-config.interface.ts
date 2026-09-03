export interface AppConfig {
  readonly app: {
    readonly port: number;
    readonly nodeEnv: string;
  };

  readonly database: {
    readonly url: string;
  };

  readonly redis: {
    readonly host: string;
    readonly port: number;
    readonly username?: string;
    readonly password?: string;
    readonly db: number;
  };

  readonly jwt: {
    readonly accessSecret: string;
    readonly accessExpiresIn: string;
    readonly refreshSecret: string;
    readonly refreshExpiresIn: string;
  };

  readonly storage: {
    readonly localRoot: string;
  };
}