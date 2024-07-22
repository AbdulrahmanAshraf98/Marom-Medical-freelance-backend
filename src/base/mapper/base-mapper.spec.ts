import { BaseMapper } from './base-mapper';
import { DummyEntity } from '../../../test/__mocks__/dummy-entity/dummy-entity';
import { TestDto } from '../../../test/__mocks__/test-dto/test-dto';

describe('BaseMapper', () => {
  it('should be defined', () => {
    expect(new BaseMapper()).toBeDefined();
  });
  it('should map map a single entity to a DTO', () => {
    const entity: DummyEntity = new DummyEntity(1, 'Test Name', true);
    const dto: TestDto = BaseMapper.toDto<TestDto, DummyEntity>(
      TestDto,
      entity,
    );
    expect(dto).toBeInstanceOf(TestDto);
    expect(dto.id).toEqual(entity.id);
    expect(dto.name).toEqual(entity.name);
    expect(dto.is_active).toBeUndefined();
  });
  it('should map an array of entities to an array of DTOs', () => {
    const entities: DummyEntity[] = [
      new DummyEntity(1, 'Test Name 1', true),
      new DummyEntity(2, 'Test Name 2', false),
    ];

    const dtos: TestDto[] = BaseMapper.toDtos(TestDto, entities);
    expect(dtos).toHaveLength(2);
    expect(dtos[0]).toBeInstanceOf(TestDto);
    expect(dtos[1]).toBeInstanceOf(TestDto);
    expect(dtos[0].id).toEqual(1);
    expect(dtos[1].name).toEqual('Test Name 2');
    expect(dtos[0].is_active).toBeUndefined();
    expect(dtos[1].is_active).toBeUndefined();
  });
  it('should map a plain object to a DTO', () => {
    const plainObject: object = { id: 1, name: 'Test Name', is_active: true };

    const dto: TestDto = BaseMapper.toDtoFromPlain(TestDto, plainObject);

    expect(dto).toBeInstanceOf(TestDto);
    expect(dto.id).toEqual(1);
    expect(dto.name).toEqual('Test Name');
    expect(dto.is_active).toBeUndefined();
  });
});
