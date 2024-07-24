import {  Injectable } from '@nestjs/common';
import { BaseRepository} from '../../../src/base/repositories/base-repository/base-repository';
import { TestEntity } from '../test-entity/test-entity';
import { EntityManager } from 'typeorm';


@Injectable()
export class TestRepository extends BaseRepository<TestEntity> {
  constructor(entityManager: EntityManager) {
    super(TestEntity, entityManager);
  }
}
