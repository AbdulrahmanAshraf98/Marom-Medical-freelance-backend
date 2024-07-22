export class DummyEntity {
  id: number;
  name: string;
  is_active: boolean;

  constructor(id: number, name: string, is_active: boolean) {
    this.id = id;
    this.name = name;
    this.is_active = is_active;
  }
}
