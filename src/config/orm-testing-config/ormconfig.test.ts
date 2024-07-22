import { DataSource } from 'typeorm';
import { BaseEntity } from '../../base/entities/base-entity/base-entity';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [BaseEntity],
  synchronize: true,
  logging: false,
});
