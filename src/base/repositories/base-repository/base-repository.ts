import {
  Repository,
  FindManyOptions,
  UpdateResult,
  DeleteResult,
  FindOneOptions,
  In,
  Not,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { BaseEntity } from '../../entities/base-entity/base-entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  private readonly DEFAULT_PAGE = 0;
  private readonly DEFAULT_LIMIT = 20;
  private readonly DEFAULT_SORT_BY = 'id';
  private readonly DEFAULT_ORDER: 'ASC' | 'DESC' = 'DESC';
  async findAllWithPagination(
    conditions: FindManyOptions<T>['where'] = {},
    relations: string[] = [],
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT,
    sortBy: string = this.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.DEFAULT_ORDER,
  ): Promise<{ items: T[]; totalCount: number }> {
    const [items, totalCount] = await this.findAndCount({
      where: conditions,
      relations,
      skip: page * limit,
      take: limit,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
    return { items, totalCount };
  }

  async findAllWithoutPagination(
    conditions: FindManyOptions<T>['where'] = {},
    relations: string[] = [],
    sortBy: string = this.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.DEFAULT_ORDER,
  ): Promise<T[]> {
    return this.find({
      where: conditions,
      relations,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
  }

  async findOneBy(
    conditions: FindOneOptions<T>['where'],
  ): Promise<T | null> {
    return this.findOne({ where: conditions } as FindOneOptions<T>);
  }
  async updateBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    updateDto: Partial<T>,
  ): Promise<{ updatedEntities: T[]; updateResult: UpdateResult }> {
    // Perform the update operation
    const updateResult: UpdateResult = await this.update(
      conditions as any,
      updateDto as any,
    );
    const findOptions: FindManyOptions<T> = {
      where: conditions,
    };
    const updatedEntities:(T)[] = await this.find(findOptions);
    return { updatedEntities, updateResult };
  }

  async deleteBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<DeleteResult> {
    return this.delete(conditions as any);
  }

  private async findWithCondition(
    field: keyof T,
    condition: 'in' | 'notIn',
    values: any[],
    relations: string[] = [],
    sortBy: string = this.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.DEFAULT_ORDER,
  ): Promise<T[]> {
    const whereCondition =
      condition === 'in'
        ? { [field]: In(values) }
        : { [field]: Not(In(values)) };

    return this.find({
      where: whereCondition as FindOptionsWhere<T>,
      relations,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
  }

  async findWithIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string = this.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.DEFAULT_ORDER,
  ): Promise<T[]> {
    return this.findWithCondition(
      field,
      'in',
      values,
      relations,
      sortBy,
      order,
    );
  }

  async findWithNotIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string = this.DEFAULT_SORT_BY,
    order: 'ASC' | 'DESC' = this.DEFAULT_ORDER,
  ): Promise<T[]> {
    return this.findWithCondition(
      field,
      'notIn',
      values,
      relations,
      sortBy,
      order,
    );
  }
}
