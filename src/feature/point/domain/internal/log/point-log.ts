import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointType } from '@/feature/point/domain/interface/point-type';
import { IdGenerator } from '@/common/id-generator/id-generator';

export class PointLog {

  constructor(
    readonly id: bigint,
    readonly amount: PointAmount,
    readonly type: PointType,
    readonly createdAt: Date,
    readonly transactionId?: bigint,
    readonly expirationAt?: Date,
  ) { }

  get signedAmount(): number {
    return ['use', 'expired'].includes(this.type)
      ? -this.amount
      : this.amount;
  }

  static create(param: Pick<PointLog, 'amount' | 'type' | 'transactionId' | 'expirationAt'>) {
    return new PointLog(
      IdGenerator.nextId(),
      param.amount,
      param.type,
      new Date(),
      param.transactionId,
      param.expirationAt,
    );
  }
}
