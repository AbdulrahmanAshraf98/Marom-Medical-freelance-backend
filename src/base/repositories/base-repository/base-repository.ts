import { Repository,  FindManyOptions, UpdateResult, DeleteResult, FindOneOptions, In, Not } from 'typeorm';
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
      order: { [sortBy]: order },
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
      order: { [sortBy]: order },
    });
  }

  async findOneBy(
    conditions: FindOneOptions<T>['where'],
  ): Promise<T | undefined> {
    return this.findOne(conditions);
  }

  async updateBy(
    conditions: FindManyOptions<T>['where'],
    updateDto: Partial<T>,
  ): Promise<UpdateResult> {
    return this.update(conditions, updateDto);
  }

  async deleteBy(
    conditions: FindManyOptions<T>['where'],
  ): Promise<DeleteResult> {
    return this.delete(conditions);
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
      },
      relations,
      order: { [sortBy]: order },
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
      },
      relations,
      order: { [sortBy]: order },
    });
  }


}
