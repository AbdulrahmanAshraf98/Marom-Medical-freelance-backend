import { Exclude, Expose } from 'class-transformer';

export class TestDto {
  @Expose()
  id: number;
  @Expose()
  name:string;
  @Exclude()
  is_active: boolean;
}
