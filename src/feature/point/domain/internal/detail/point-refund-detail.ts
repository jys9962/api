import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@/feature/point/domain/internal/detail/point-used-detail';
import { IdGenerator } from '@/common/id-generator/id-generator';

export class PointRefundDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly log: PointLog,
    readonly addedDetail: PointAddedDetail,
    readonly usedDetail: PointUsedDetail,
  ) {}

  get signedAmount() {
    return this.amount;
  }

  static create(
    amount: PointAmount,
    log: PointLog,
    useDetail: PointUsedDetail,
  ) {
    return new PointRefundDetail(
      IdGenerator.nextId(),
      amount,
      log,
      useDetail.addedDetail,
      useDetail,
    );
  }
}
