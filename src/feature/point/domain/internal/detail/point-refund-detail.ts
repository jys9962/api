import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointCommand } from '@/feature/point/domain/internal/command/point-command';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@/feature/point/domain/internal/detail/point-used-detail';
import { IdGenerator } from '@/common/id-generator/id-generator';

export class PointRefundDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly transactionId: bigint,
    readonly addedDetail: PointAddedDetail,
  ) {}

  get signedAmount() {
    return this.amount;
  }

  static create(
    amount: PointAmount,
    transactionId: bigint,
    addedDetail: PointAddedDetail,
  ) {
    return new PointRefundDetail(
      IdGenerator.nextId(),
      amount,
      transactionId,
      addedDetail,
    );
  }
}
