import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointCommand } from '@/feature/point/domain/internal/command/point-command';
import { IdGenerator } from '@/common/id-generator/id-generator';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';

export class PointExpiredDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly addedDetail: PointAddedDetail,
  ) { }

  get usedDetail() {
    return null;
  }

  get transactionId() {
    return undefined
  };



  get signedAmount(): number {
    return -this.amount;
  }

  static create(
    amount: PointAmount,
    addedDetail: PointAddedDetail,
  ) {
    return new PointExpiredDetail(
      IdGenerator.nextId(),
      amount,
      addedDetail,
    );
  }
}
