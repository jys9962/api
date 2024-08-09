import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { Timestamp } from '@/common/value-object/timestamp/timestamp';
import { PointType } from '@/feature/point/domain/interface/point-type';
import { DynamoEntityBuilder } from '@/libs/dynamodb/model/dynamo-entity-builder';

export const PointCommandEntity = DynamoEntityBuilder
  .create({
    pk: 'pointLog#{memberId}',
    sk: '{id}'
  })
  .with<{
    type: PointType;
    amount: PointAmount;
    createdAt: Timestamp;
    transactionId?: string;
    expirationAt?: Timestamp;
  }>()
  .build();

export type IPointCommandEntity = DynamoEntityBuilder.Type<typeof PointCommandEntity>
