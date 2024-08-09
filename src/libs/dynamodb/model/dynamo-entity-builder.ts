import { DynamoEntity } from '@/libs/dynamodb/model/dynamo-entity';
import { DynamoItem, ParseKey } from '@/libs/dynamodb/interface/dynamo-entity.interface';

export class DynamoEntityBuilder<
  const TKey extends Record<string, string>,
  const TProps extends Record<string, any>
> {

  private constructor(
    readonly key: TKey
  ) {}

  static create<const T extends Record<string, string>>(key: T) {
    return new DynamoEntityBuilder<T, {}>(key);
  }

  with<TProp extends DynamoItem>(): DynamoEntityBuilder<TKey, TProp> {
    return new DynamoEntityBuilder<TKey, TProp>(this.key);
  }

  build(): DynamoEntity<TKey, TProps> {
    return new DynamoEntity<TKey, TProps>(this.key);
  }
}

export namespace DynamoEntityBuilder {
  export type Type<T extends DynamoEntity<any, any>> =
    T extends DynamoEntity<infer TKey, infer TProp>
      ? ParseKey<TKey> & TProp
      : never

}
