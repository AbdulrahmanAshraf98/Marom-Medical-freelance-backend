import { Inject, Injectable } from '@nestjs/common';
import { TestRepository } from '../test-repository/test-repository';
import { TestDto } from '../test-dto/test-dto';
import { TestEntity } from '../test-entity/test-entity';
import { BaseService } from '../../../src/base/services/base/base.service';

@Injectable()
export class TestServiceService extends BaseService<TestEntity, TestDto> {
  constructor(@Inject(TestRepository) private readonly repo: TestRepository) {
    super(repo, TestDto);
  }
}
