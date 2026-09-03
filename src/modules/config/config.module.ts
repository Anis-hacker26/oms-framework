import {
  Global,
  Module,
} from '@nestjs/common';

import {
  APP_CONFIG,
} from './constants/config.constants';

import {
  AppConfigProvider,
} from './providers/app-config.provider';

import {
  AppConfigService,
} from './services/app-config.service';

@Global()
@Module({
  providers: [
    AppConfigProvider,

    {
      provide: APP_CONFIG,
      useFactory: (
        provider: AppConfigProvider,
      ) => provider.getConfig(),

      inject: [
        AppConfigProvider,
      ],
    },

    AppConfigService,
  ],

  exports: [
    AppConfigService,
    APP_CONFIG,
  ],
})
export class ConfigModule {}