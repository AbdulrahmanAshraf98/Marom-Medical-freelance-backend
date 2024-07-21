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

  async findAllWithPagination(
    conditions: FindManyOptions<T>['where'] = {},
    relations: string[] = [],
    page: number = 0,
    limit: number = 20,
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
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
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<T[]> {
    return this.find({
      where: conditions,
      relations,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
  }

  async findOneBy(
    conditions: FindOneOptions<T>['where'],
  ): Promise<T | undefined> {
    return this.findOne({ where: conditions } as FindOneOptions<T>);
  }

  async updateBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    updateDto: Partial<T>,
  ): Promise<UpdateResult> {
    // Cast `updateDto` to match `_QueryDeepPartialEntity<T>`
    return this.update(conditions as any, updateDto as any);
  }

  async deleteBy(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<DeleteResult> {
    return this.delete(conditions as any);
  }

  async findWithIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<T[]> {
    return this.find({
      where: {
        [field]: In(values),
      } as FindOptionsWhere<T>,
      relations,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
  }

  async findWithNotIn(
    field: keyof T,
    values: any[],
    relations: string[] = [],
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<T[]> {
    return this.find({
      where: {
        [field]: Not(In(values)),
      } as FindOptionsWhere<T>,
      relations,
      order: { [sortBy]: order } as FindOptionsOrder<T>,
    });
  }
}
