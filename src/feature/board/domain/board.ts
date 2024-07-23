import { IdGenerator } from '@/common/id-generator/id-generator';

export class Board {

  constructor(
    public id: bigint,
    public name: string,
  ) {}

  static create(
    name: string,
  ): Board {
    return new Board(
      IdGenerator.nextId(),
      name,
    );
  }
}
