import { DataSource } from 'typeorm';
import { TestEntity } from '../../../test/__mocks__/test-entity/test-entity';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [TestEntity],
  synchronize: true,
  logging: false,
});
