import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { IdGenerator } from '@/common/id-generator/id-generator';

export class PointAddedDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly log: PointLog,
  ) {}

  get signedAmount(): number {
    return this.amount;
  }

  get usedDetail() {
    return null;
  }

  get addedDetail() {
    return this;
  }

  get transactionId() {
    return null;
  }

  static create(
    log: PointLog,
  ) {
    return new PointAddedDetail(
      IdGenerator.nextId(),
      log.amount,
      log,
    );
  }
}
