import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/app-config/app-config.module';
import { getDatabaseConfig } from './config/database-config/database.config';

@Module({
  imports: [
    AppConfigModule, // Import your configuration module
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        await getDatabaseConfig(configService),
      inject: [ConfigService], // Inject ConfigService to access config values
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
