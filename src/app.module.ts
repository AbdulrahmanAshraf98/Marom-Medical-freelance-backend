import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/app-config/app-config.module';
import { getDatabaseConfig } from './config/database-config/database.config';
import { i18nConfig } from './config/i18n.config';


@Module({
  imports: [
    AppConfigModule, // Import your configuration module
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        await getDatabaseConfig(configService),
      inject: [ConfigService], // Inject ConfigService to access config values
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
    }),
    I18nModule.forRoot(i18nConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
