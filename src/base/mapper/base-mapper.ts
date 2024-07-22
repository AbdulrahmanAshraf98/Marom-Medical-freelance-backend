import { plainToInstance } from 'class-transformer';

export class BaseMapper {
  static  toDto<T,V>(cls: new (...args: any[]) => T, plain: V):T{
    return  plainToInstance(cls,plain,{excludeExtraneousValues:true});
  }
  /**
   * Converts an array of entities to an array of DTOs.
   * @param dtoClass - The class of the DTO to transform to.
   * @param entities - The entities to transform.
   * @returns An array of DTO instances.
   */
  static toDtos<T, V>(dtoClass: new (...args: any[]) => T, entities: V[]): T[] {
    return entities.map(entity => plainToInstance(dtoClass, entity, { excludeExtraneousValues: true }));
  }

  /**
   * Converts a plain object to an instance of a DTO.
   * @param dtoClass - The class of the DTO to transform to.
   * @param plainObject - The plain object to transform.
   * @returns An instance of the DTO.
   */
  static toDtoFromPlain<T>(dtoClass: new (...args: any[]) => T, plainObject: object): T {
    return plainToInstance(dtoClass, plainObject, { excludeExtraneousValues: true });
  }
}
