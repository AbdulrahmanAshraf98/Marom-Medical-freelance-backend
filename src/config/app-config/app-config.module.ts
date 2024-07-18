import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module available globally
      envFilePath: ['.env'], // Specify the path to your .env file
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
