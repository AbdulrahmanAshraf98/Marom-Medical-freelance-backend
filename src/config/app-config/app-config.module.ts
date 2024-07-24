import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module available globally
      envFilePath: ['.env'], // Specify the path to your .env file
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'public')
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
