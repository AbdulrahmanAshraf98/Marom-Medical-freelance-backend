import { BaseRepository } from './base-repository';
import { BaseEntity } from '../../entities/base-entity/base-entity';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  LessThan,
  Repository,
  UpdateResult,
} from 'typeorm';
import { testDataSource } from '../../../config/orm-testing-config/ormconfig.test';

describe('BaseRepository Integration Test', () => {
  let baseRepository: BaseRepository<BaseEntity>;
  let repository: Repository<BaseEntity>;
  let dataSource: DataSource;
  let mockItems: BaseEntity[];
  const totalCount: number = 100;
  beforeAll(async () => {
    dataSource = testDataSource;
    await dataSource.initialize();
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  beforeEach(async () => {
    repository = testDataSource.getRepository(BaseEntity);
    baseRepository = new BaseRepository<BaseEntity>(
      BaseEntity as any,
      repository.manager,
    );

    await repository.clear();
    mockItems = Array.from({ length: 100 }, (_, index) => {
      const item = new BaseEntity();
      item.id = index + 1;
      return item;
    });

    await repository.save(mockItems);
  });
  it('should find all items with pagination', async () => {
    const result: { items: BaseEntity[]; totalCount: number } =
      await baseRepository.findAllWithPagination({}, [], 0, 10, 'id', 'ASC');
    expect(result).toEqual({ items: mockItems.slice(0, 10), totalCount });
  });
  it('should find all items with pagination and desc order ', async () => {
    const result: { items: BaseEntity[]; totalCount: number } =
      await baseRepository.findAllWithPagination({}, [], 0, 10, 'id', 'DESC');
    expect(result).toEqual({
      items: mockItems.reverse().slice(0, 10),
      totalCount,
    });
  });

  it('should find items with condition where ids less than 10  ', async () => {
    // Define the condition to find items with IDs less than 10
    const result: { items: BaseEntity[]; totalCount: number } =
      await baseRepository.findAllWithPagination(
        { id: LessThan(10) },
        [],
        0,
        5,
        'id',
        'ASC',
      );
    expect(result).toEqual({ items: mockItems.slice(0, 5), totalCount: 9 });
  });
  it('should return all without pagination ', async () => {
    const result: BaseEntity[] =
      await baseRepository.findAllWithoutPagination();
    expect(result).toEqual(mockItems.reverse());
  });
  it('should return one item by condition ', async () => {
    const item: BaseEntity = await baseRepository.findOneBy({ id: 1 });
    expect(item).toEqual(
      mockItems.filter((item: BaseEntity) => item.id == 1)[0],
    );
  });
  it('should return null for  item not found ', async () => {
    const item: BaseEntity | null = await baseRepository.findOneBy({ id: 110 });
    expect(item).toBeNull();
  });
  it('should update active to false for  item with id equal one  ', async (): Promise<void> => {
    const updateDto = { is_active: false }; // Assuming BaseEntity has a 'name' field

    const conditions: any = { id: 1 };

    const { updatedEntities, updateResult } = await baseRepository.updateBy(
      conditions,
      updateDto,
    );
    expect(updateResult).toBeInstanceOf(UpdateResult);
    expect(updateResult.affected).toEqual(1);
    expect(updatedEntities).toHaveLength(1);
    expect(updatedEntities[0].is_active).toBe(false);
  });
  it('should update active to false for all items has a is_active equal true  ', async (): Promise<void> => {
    const updateDto = { is_active: false }; // Assuming BaseEntity has a 'name' field
    const conditions: any = { is_active: true };
    const { updatedEntities, updateResult } = await baseRepository.updateBy(
      conditions,
      updateDto,
    );
    const result = await baseRepository.findAllWithoutPagination({
      is_active: false,
    });
    expect(updateResult).toBeInstanceOf(UpdateResult);
    expect(updateResult.affected).toEqual(100);
    expect(updatedEntities).toHaveLength(0);
    expect(result).toHaveLength(totalCount);
  });
  it('should delete by item with id equal one ', async () => {
    const conditions: any = { id: 1 };
    const result: DeleteResult = await baseRepository.deleteBy(conditions);
    expect(result).toBeInstanceOf(DeleteResult);
    expect(result.affected).toEqual(1);
  });
  it('should not find a deleted item', async () => {
    const conditions: FindOptionsWhere<BaseEntity> = { id: 110 };
    await baseRepository.deleteBy(conditions);
    const item: BaseEntity | undefined =
      await baseRepository.findOneBy(conditions);
    expect(item).toBeNull();
  });
  it('should handle invalid update conditions gracefully', async () => {
    const updateDto = { is_active: false };
    const conditions: any = { id: 'invalid' }; // Invalid condition type

    try {
      await baseRepository.updateBy(conditions, updateDto);
    } catch (error) {
      expect(error).toBeInstanceOf(Error); // Adjust based on the expected error type
    }
  });

  it('should handle invalid delete conditions gracefully', async () => {
    const conditions: any = { id: 'invalid' }; // Invalid condition type

    try {
      await baseRepository.deleteBy(conditions);
    } catch (error) {
      expect(error).toBeInstanceOf(Error); // Adjust based on the expected error type
    }
  });
});
