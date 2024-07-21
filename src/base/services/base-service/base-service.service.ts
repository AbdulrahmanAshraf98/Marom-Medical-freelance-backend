import { Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere, In, Not } from 'typeorm';
import { BaseRepository } from '../../repositories/base-repository/base-repository';
import { BaseEntity } from '../../entities/base-entity/base-entity';

@Injectable()
export class BaseService<T extends BaseEntity> {
  constructor(@Inject('BaseRepository')  private readonly repository: BaseRepository<T>) {}

  async findOneById(id: number): Promise<T | undefined> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  async updateById(id: number, updateDto: Partial<T>): Promise<void> {
    await this.repository.updateBy({ id } as unknown as FindOptionsWhere<T>, updateDto);
  }

  async findWithIn(
    field: keyof T,
    values: any[],
  ): Promise<T[]> {
    const conditions: FindOptionsWhere<T> = { [field]: In(values) } as any;
    return this.repository.findWithIn(field, values);
  }

  async findWithNotIn(
    field: keyof T,
    values: any[],
  ): Promise<T[]> {
    const conditions: FindOptionsWhere<T> = { [field]: Not(In(values)) } as any;
    return this.repository.findWithNotIn(field, values);
  }
}
