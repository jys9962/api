import { MemberPointEntity } from '@/feature/point/repository/entity/member-point.entity';
import { MemberPoint } from '@/feature/point/domain/member-point';
import { DynamoUtil } from '@/libs/dynamodb/util/dynamo-util';
import { BigIntMath } from '@/common/util/bigint/big-math';

export namespace MemberPointMapper {
  export const toPersistence = (
    memberId: bigint,
    memberPoint: MemberPoint,
  ): MemberPointEntity => {
    return {
      pk: DynamoUtil.createKey(MemberPointEntity.pk, {
        memberId: memberId.toString(),
      }),
      sk: DynamoUtil.createKey(MemberPointEntity.sk, {}),
      balance: memberPoint.balance,
      lastLogId: BigIntMath
        .max(
          ...memberPoint.commandList.map(t => t.id),
        )
        .toString(),
    };
  };
}
