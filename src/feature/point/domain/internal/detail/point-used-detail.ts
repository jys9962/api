import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointCommand } from '@/feature/point/domain/internal/log/point-command';
import { IdGenerator } from '@/common/id-generator/id-generator';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';

export class PointUsedDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly transactionId: bigint,
    readonly addedDetail: PointAddedDetail,
  ) {}

  get signedAmount() {
    return -this.amount;
  }

  get usedDetail() {
    return this;
  }

  static create(
    transactionId: bigint,
    addedDetail: PointAddedDetail,
    amount: PointAmount,
  ) {
    return new PointUsedDetail(
      IdGenerator.nextId(),
      amount,
      transactionId,
      addedDetail,
    );
  }

}
