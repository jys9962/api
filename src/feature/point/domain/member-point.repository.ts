import { MemberPoint } from '@/feature/point/domain/member-point';

export abstract class MemberPointRepository {

  abstract find(
    memberId: bigint,
  ): Promise<MemberPoint>

  abstract save(
    memberId: bigint,
    memberPoint: MemberPoint,
  ): Promise<void>

}
