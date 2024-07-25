import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { IdGenerator } from '@/common/id-generator/id-generator';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';

export class PointExpiredDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly log: PointLog,
    readonly addedDetail: PointAddedDetail,
  ) { }

  get usedDetail() {
    return null;
  }

  get signedAmount(): number {
    return -this.amount;
  }

  static create(
    log: PointLog,
    amount: PointAmount,
    addedDetail: PointAddedDetail,
  ) {
    return new PointExpiredDetail(
      IdGenerator.nextId(),
      amount,
      log,
      addedDetail,
    );
  }
}
