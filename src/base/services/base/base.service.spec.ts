import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DeleteResult } from 'typeorm';
import { TestEntity } from '../../../../test/__mocks__/test-entity/test-entity';
import { TestDto } from '../../../../test/__mocks__/test-dto/test-dto';
import { TestRepository } from '../../../../test/__mocks__/test-repository/test-repository';
import { TestServiceService } from '../../../../test/__mocks__/test-service/test-service.service';
import { testDataSource } from '../../../config/orm-testing-config/ormconfig.test';
import { BaseMapper } from '../../mapper/base-mapper';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TestServiceService Integration Test', () => {
  let service: TestServiceService;
  let repository: TestRepository;
  let dataSource: DataSource;
  let mockItems: TestEntity[];

  beforeAll(async () => {
    dataSource = testDataSource;
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Set up the NestJS testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TestEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TestEntity]),
      ],
      providers: [TestServiceService, TestRepository],
      exports: [TestServiceService, TestRepository],
    }).compile();

    service = module.get<TestServiceService>(TestServiceService);
    repository = module.get<TestRepository>(TestRepository);

    // Create and save mock items
    mockItems = Array.from({ length: 100 }, (_, index) => {
      const item = new TestEntity();
      item.id = index + 1;
      return item;
    });

    await repository.save(mockItems);
  });

  afterEach(async () => {
    // Clear the repository after each test
    await repository.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an entity', async () => {
    const createDto: Partial<TestEntity> = { is_active: true };
    const result: TestDto = await service.create(createDto);

    const savedEntity: TestEntity = await repository.findOneBy({
      id: result.id,
    });
    expect(savedEntity).toBeDefined();
    expect(savedEntity.is_active).toBe(createDto.is_active);
    expect(result).toBeInstanceOf(TestDto);
    expect(result.id).toEqual(101); // assuming the next ID is 101
  });

  it('should find all entities with pagination', async () => {
    const { items, totalCount } = await service.findAllWithPagination(
      {},
      [],
      0,
      10,
      'id',
      'ASC',
    );

    expect(items).toHaveLength(10);
    expect(items[0].id).toEqual(mockItems[0].id);
    expect(totalCount).toBe(100);
  });

  it('should update an entity', async () => {
    const updateDto: Partial<TestEntity> = { is_active: false };
    const result = await service.updateBy({ is_active: true }, updateDto);
    console.log(result[0]);
    expect(result).toHaveLength(0);

  });

  it('should delete an entity', async () => {
    await service.deleteBy({ id: 1 });

    const deletedEntity = await repository.findOneBy({ id: 1 });
    expect(deletedEntity).toBeNull();
  });

  it('should find all entities without pagination', async () => {
    const items = await service.findAllWithoutPagination({}, [], 'id', 'ASC');

    expect(items).toHaveLength(100);
  });

  it('should find one entity by condition', async () => {
    const result = await service.findOneBy({ id: 1 });

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException if entity not found', async () => {
    await expect(service.findOneBy({ id: 999 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if create fails', async () => {
    // Simulate a failure in the repository
    jest.spyOn(repository, 'save').mockRejectedValue(new Error('Create failed'));

    await expect(service.create({} as Partial<TestEntity>)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if update fails', async () => {
    // Simulate a failure in the repository
    jest.spyOn(repository, 'updateBy').mockResolvedValue({
      updatedEntities: [],
      updateResult: { affected: 0 } as any,
    });

    await expect(
      service.updateBy({ id: 1 }, { is_active: false }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if delete fails', async () => {
    // Simulate a failure in the repository
    jest.spyOn(repository, 'deleteBy').mockResolvedValue({
      affected: 0,
    } as DeleteResult);

    await expect(service.deleteBy({ id: 1 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should find entities with "in" condition', async () => {
    const items = await service.findWithIn('id', [1, 2, 3]);

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.id)).toEqual([3, 2, 1]);
  });

  it('should find entities with "not in" condition', async () => {
    const items = await service.findWithNotIn('id', [1, 2, 3]);

    expect(items).toHaveLength(97);
    expect(items.every((item) => ![1, 2, 3].includes(item.id))).toBe(true);
  });
});
