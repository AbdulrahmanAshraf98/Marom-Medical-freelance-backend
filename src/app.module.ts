import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/app-config/app-config.module';
import { getDatabaseConfig } from './config/database-config/database.config';
import { join } from 'path';
import { TranslationService } from './common/service/translation/translation.service';
import { BaseModuleModule } from './base/base-module/base-module.module';


@Module({
  imports: [
    AppConfigModule, // Import your configuration module
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE', 'en'),
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,

        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        await getDatabaseConfig(configService),
      inject: [ConfigService], // Inject ConfigService to access config values
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
    }),
    BaseModuleModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    TranslationService,
    ],
})
export class AppModule {}
