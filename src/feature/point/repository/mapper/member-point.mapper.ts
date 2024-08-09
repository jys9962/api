import { IMemberPointEntity, MemberPointEntity } from '@/feature/point/repository/entity/member-point.entity';
import { MemberPoint } from '@/feature/point/domain/member-point';
import { BigIntMath } from '@/common/util/bigint/big-math';

export namespace MemberPointMapper {
  export const toPersistence = (
    memberId: bigint,
    memberPoint: MemberPoint
  ): IMemberPointEntity => {
    return {
      pk: MemberPointEntity.key('pk', {
        memberId: memberId.toString()
      }),
      sk: MemberPointEntity.key('sk', {}),
      balance: memberPoint.balance,
      lastLogId: BigIntMath
        .max(
          ...memberPoint.commandList.map(t => t.id)
        )
        .toString()
    };
  };
}
