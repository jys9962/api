export class Article {

  constructor(
    public id: bigint,
    public title: string,
    public content: string,
    public createdAt: Date,
  ) {}

  static create() {

  }


}
