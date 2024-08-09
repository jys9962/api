import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { Timestamp } from '@/common/type/timestamp';
import { PointType } from '@/feature/point/domain/interface/point-type';
import { Dynamo } from '@/libs/dynamodb/type/dynamo.type';
import { MemberPointEntity } from '@/feature/point/repository/entity/member-point.entity';

export interface PointLogEntity {
  pk: Dynamo.Key<PointLogEntity.pk>;
  sk: Dynamo.Key<PointLogEntity.sk>;

  type: PointType;
  amount: PointAmount;
  createdAt: Timestamp;
  transactionId?: bigint;
  expirationAt?: Timestamp;
}

export namespace PointLogEntity {
  export const pk = 'pointLog#{memberId}';
  export const sk = '{id}';

  export type pk = typeof pk
  export type sk = typeof sk
}
