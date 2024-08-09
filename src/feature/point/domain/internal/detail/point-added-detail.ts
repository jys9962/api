import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointCommand } from '@/feature/point/domain/internal/log/point-command';
import { IdGenerator } from '@/common/id-generator/id-generator';

export class PointAddedDetail implements PointDetail {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly expirationAt: Date,
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
    return undefined
  }

  static create(
    log: PointCommand,
  ) {
    return new PointAddedDetail(
      IdGenerator.nextId(),
      log.amount,
      log.expirationAt!,
    );
  }
}
