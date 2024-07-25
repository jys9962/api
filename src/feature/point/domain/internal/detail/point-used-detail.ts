import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { IdGenerator } from '@/common/id-generator/id-generator';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';

export class PointUsedDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly log: PointLog,
    readonly addedDetail: PointAddedDetail,
  ) {}

  get signedAmount() {
    return -this.amount;
  }

  get usedDetail() {
    return this;
  }

  static create(
    log: PointLog,
    addedDetail: PointAddedDetail,
    amount: PointAmount,
  ) {
    return new PointUsedDetail(
      IdGenerator.nextId(),
      amount,
      log,
      addedDetail,
    );
  }

}
