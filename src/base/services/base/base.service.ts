import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FindOptionsWhere, FindManyOptions, DeleteResult } from 'typeorm';
import { BaseRepository } from '../../repositories/base-repository/base-repository';
import { BaseEntity } from '../../entities/base-entity/base-entity';
import { BaseMapper } from '../../mapper/base-mapper';

@Injectable()
export abstract class BaseService<T extends BaseEntity, D> {
  protected constructor(
    private readonly repository: BaseRepository<T>,
    private readonly dtoClass: new (...args: any[]) => D,
  ) {}

  async findAllWithPagination(
    conditions: FindManyOptions<T>['where'] = {},
    relations: string[] = [],
    page: number = this.repository.DEFAULT_PAGE,
    limit: number = this.repository.DEFAULT_LIMIT,
    sortBy: string = this.repository.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.repository.DEFAULT_ORDER,
  ): Promise<{ items: D[]; totalCount: number }> {
    try {
      const { items, totalCount } = await this.repository.findAllWithPagination(
        conditions,
        relations,
        page,
        limit,
        sortBy,
        order,
      );
      return {
        items: BaseMapper.toDtos(this.dtoClass, items),
        totalCount,
      };
    } catch (error) {
      throw new BadRequestException('failed_fetch');
    }
  }

  async findAllWithoutPagination(
    conditions: FindManyOptions<T>['where'] = {},
    relations: string[] = [],
    sortBy: string = this.repository.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.repository.DEFAULT_ORDER,
  ): Promise<D[]> {
    try {
      const entities: T[] = await this.repository.findAllWithoutPagination(
        conditions,
        relations,
        sortBy,
        order,
      );
      return BaseMapper.toDtos(this.dtoClass, entities);
    } catch (error) {
      throw new BadRequestException('failed_fetch');
    }
  }

  async findOneBy(conditions: FindOptionsWhere<T>): Promise<D | undefined> {
    const entity: T = await this.repository.findOneBy(conditions);
    if (!entity) {
      throw new NotFoundException('entity_not_found');
    }
    return BaseMapper.toDto(this.dtoClass, entity);
  }
  async create(createDto: Partial<T>): Promise<D> {
    try {
      const entity: T[] = this.repository.create(createDto as any);
      const savedEntity: T[] = await this.repository.save(entity);
      return BaseMapper.toDto(this.dtoClass, savedEntity);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('create_failed');
    }
  }

  async updateBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    updateDto: Partial<T>,
  ): Promise<D[]> {
    const result = await this.repository.updateBy(conditions, updateDto);
    if (result.updateResult.affected === 0)
      throw new BadRequestException('update_failed');
    return BaseMapper.toDtos(this.dtoClass, result.updatedEntities);
  }

  async deleteBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<void> {
    const result: DeleteResult = await this.repository.deleteBy(conditions);
    if (result.affected === 0) {
      throw new BadRequestException('delete_failed');
    }
  }

  async findWithIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string=this.repository.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC'=this.repository.DEFAULT_ORDER,
  ): Promise<D[]> {
    const entities = await this.repository.findWithIn(
      field,
      values,
      relations,
      sortBy,
      order,
    );
    if (!entities.length) {
      throw new NotFoundException('entity_not_found');
    }
    return BaseMapper.toDtos(this.dtoClass, entities);
  }

  async findWithNotIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string=this.repository.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC'=this.repository.DEFAULT_ORDER,
  ): Promise<D[]> {
    const entities: T[] = await this.repository.findWithNotIn(
      field,
      values,
      relations,
      sortBy,
      order,
    );
    if (!entities.length) {
      throw new NotFoundException('entity_not_found');
    }
    return BaseMapper.toDtos(this.dtoClass, entities);
  }
}
