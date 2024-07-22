import { TestEntity } from './test-entity';

describe('TestEntity', () => {
  it('should be defined', () => {
    expect(new TestEntity()).toBeDefined();
  });
});
