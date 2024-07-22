import { Entity } from 'typeorm';
import { BaseEntity } from '../../../src/base/entities/base-entity/base-entity';

@Entity()
export class TestEntity extends BaseEntity{
  constructor() {
    super();
  }
}
