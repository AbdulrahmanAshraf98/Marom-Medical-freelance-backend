import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../repositories/base-repository/base-repository';

@Injectable()
export class BaseService<T> {
  constructor(private readonly repository: BaseRepository<T>) {}

  /**
   * Find all entities with optional pagination and sorting.
   * @param conditions - Conditions to filter entities.
   * @param relations - Relations to load.
   * @param page - Page number for pagination (starts from 0).
   * @param limit - Number of items per page.
   * @param sortBy - Field to sort by.
   * @param order - Order direction ('ASC' or 'DESC').
   * @returns A promise that resolves to an object containing items and optional total count.
   */
  async findAll(
    conditions: object = {},
    relations: string[] = [],
    page?: number,
    limit?: number,
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ items: T[]; totalCount?: number }> {
    if (page !== undefined && limit !== undefined) {
      return this.repository.findAllWithPagination(
        conditions,
        relations,
        page,
        limit,
        sortBy,
        order,
      );
    } else {
      const items = await this.repository.findAllWithoutPagination(
        conditions,
        relations,
        sortBy,
        order,
      );
      return { items };
    }
  }

  /**
   * Find a single entity by ID.
   * @param id - The ID of the entity to find.
   * @returns A promise that resolves to the found entity.
   * @throws NotFoundException if the entity is not found.
   */
  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException('entity_not_found');
    }
    return entity;
  }

  /**
   * Create a new entity.
   * @param createDto - Data to create the new entity.
   * @returns A promise that resolves to the created entity.
   */
  async create(createDto: Partial<T>): Promise<T> {
    try {
      return await this.repository.save(createDto as T);
    } catch (error) {
      throw new BadRequestException('create_failed');
    }
  }

  /**
   * Update an existing entity by ID.
   * @param id - The ID of the entity to update.
   * @param updateDto - Data to update the entity.
   * @returns A promise that resolves when the update is complete.
   */
  async update(id: number, updateDto: Partial<T>): Promise<void> {
    try {
      await this.repository.update(id, updateDto);
    } catch (error) {
      throw new BadRequestException('update_failed');
    }
  }

  /**
   * Hard delete an entity by ID.
   * @param id - The ID of the entity to delete.
   * @returns A promise that resolves when the entity is deleted.
   */
  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new BadRequestException('delete_failed');
    }
  }

  /**
   * Update entities matching the conditions.
   * @param conditions - Conditions to match entities.
   * @param updateDto - Data to update the matched entities.
   * @returns A promise that resolves when the update is complete.
   */
  async updateBy(conditions: object, updateDto: Partial<T>): Promise<void> {
    try {
      await this.repository.updateBy(conditions, updateDto);
    } catch (error) {
      throw new BadRequestException('update_by_failed');
    }
  }

  /**
   * Delete entities matching the conditions.
   * @param conditions - Conditions to match entities.
   * @returns A promise that resolves when the entities are deleted.
   */
  async deleteBy(conditions: object): Promise<void> {
    try {
      await this.repository.deleteBy(conditions);
    } catch (error) {
      throw new BadRequestException('delete_by_failed');
    }
  }

  /**
   * Find entities where a specific field's value is in a given set of values.
   * @param field - Field to check for inclusion.
   * @param values - Set of values to match.
   * @param relations - Relations to load.
   * @param sortBy - Field to sort by.
   * @param order - Order direction ('ASC' or 'DESC').
   * @returns A promise that resolves to an object containing items and optional total count.
   */
  async findIn(
    field: string,
    values: any[],
    relations: string[] = [],
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ items: T[]; totalCount?: number }> {
    const conditions = { [field]: In(values) };
    const items = await this.repository.findAllWithoutPagination(
      conditions,
      relations,
      sortBy,
      order,
    );
    return { items };
  }

  /**
   * Find entities where a specific field's value is not in a given set of values.
   * @param field - Field to check for exclusion.
   * @param values - Set of values to exclude.
   * @param relations - Relations to load.
   * @param sortBy - Field to sort by.
   * @param order - Order direction ('ASC' or 'DESC').
   * @returns A promise that resolves to an object containing items and optional total count.
   */
  async findNotIn(
    field: string,
    values: any[],
    relations: string[] = [],
    sortBy: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ items: T[]; totalCount?: number }> {
    const conditions = { [field]: Not(In(values)) };
    const items = await this.repository.findAllWithoutPagination(
      conditions,
      relations,
      sortBy,
      order,
    );
    return { items };
  }

  /**
   * Soft delete an entity by ID.
   * @param id - The ID of the entity to soft delete.
   * @returns A promise that resolves when the entity is soft deleted.
   */
  async softDelete(id: number): Promise<void> {
    try {
      await this.repository.softDelete(id);
    } catch (error) {
      throw new BadRequestException('delete_by_failed');
    }
  }

  /**
   * Restore a soft-deleted entity by ID.
   * @param id - The ID of the entity to restore.
   * @returns A promise that resolves when the entity is restored.
   */
  async restore(id: number): Promise<void> {
    try {
      await this.repository.restore(id);
    } catch (error) {
      throw new BadRequestException('Failed_to_restore');
    }
  }
}
