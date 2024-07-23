import { IdGenerator } from '@/common/id-generator/id-generator';

export class Category {
  constructor(
    public id: bigint,
    public boardId: bigint,
    public name: string,
  ) {}

  static create(
    boardId: bigint,
    name: string,
  ): Category {
    return new Category(
      IdGenerator.nextId(),
      boardId,
      name,
    );
  }
}
