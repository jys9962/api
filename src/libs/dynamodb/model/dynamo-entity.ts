import { DynamoUtil } from '@/libs/dynamodb/util/dynamo-util';
import {
  Dynamo,
  DynamoItem,
  EntityType,
  FormatObject,
  KeyParam
} from '@/libs/dynamodb/interface/dynamo-entity.interface';

export class DynamoEntity<
  TKey extends Record<string, string>,
  TProps extends DynamoItem
> {
  constructor(
    private readonly keyTemplate: TKey
  ) {}

  create(
    value: KeyParam<TKey> & TProps
  ): EntityType<this> {
    return Object
      .keys(this.keyTemplate)
      .reduce(
        (
          acc,
          key
        ) => {
          acc[key] = DynamoUtil.createKey(this.keyTemplate[key], value[key]);
          return acc;
        },
        { ...value } as any
      );
  }

  key<Key extends keyof TKey>(
    key: Key,
    value: FormatObject<TKey[Key]>
  ): Dynamo.Key<TKey[Key]> {
    return DynamoUtil.createKey(this.keyTemplate[key], value);
  }

  parse(
    value: EntityType<this>
  ): KeyParam<TKey> & TProps {
    return Object
      .keys(this.keyTemplate)
      .reduce(
        (
          acc,
          key
        ) => {
          acc[key] = DynamoUtil.parseKey(this.keyTemplate[key], value[key] as any);
          return acc;
        },
        { ...value } as any
      );

  }
}
