import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BaseEntity } from '../../base/entities/base-entity/base-entity';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', 'root'),
  database: configService.get<string>('DB_DATABASE', 'test'),
  autoLoadEntities: true,
  synchronize: configService.get<boolean>('DB_DATABASE_SYNCHRONIZE', false),
});
