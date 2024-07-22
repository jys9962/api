export class Article {

  constructor(
    public readonly id: bigint,
    public title: string,
    public content: string,
    public readonly createdAt: Date,
  ) {}

  static create() {
  }


}
