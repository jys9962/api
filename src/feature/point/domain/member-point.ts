import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { MapUtil } from '@/common/util/map/map.util';
import { PointCommand } from '@/feature/point/domain/internal/log/point-command';
import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@/feature/point/domain/internal/detail/point-used-detail';
import { PointExpiredDetail } from '@/feature/point/domain/internal/detail/point-expired-detail';
import { PointRefundDetail } from '@/feature/point/domain/internal/detail/point-refund-detail';

export class MemberPoint {

  readonly commandList: PointCommand[] = [];
  readonly detailList: PointDetail[] = [];

  constructor(
    private currentDate: Date,
  ) {}

  static create(currentDate: Date = new Date()) {
    return new MemberPoint(currentDate);
  }

  get balance(): PointAmount {
    const amount = this.detailList.reduce(
      (
        acc,
        t,
      ) => acc + t.signedAmount,
      0,
    );

    return PointAmount.of(amount);
  }

  setCurrentDate(date: Date) {
    if (this.currentDate.getTime() > date.getTime()) {
      throw new Error();
    }

    this.currentDate = date;

    this.syncExpired();
    return this;
  }

  execute(command: PointCommand) {
    let details: PointDetail[];
    switch (command.type) {
      case 'add':
        details = [PointAddedDetail.create(command)];
        break;
      case 'use':
        details = this.createUsedList(command);
        break;
      case 'refund':
        details = this.createRefundList(command);
        break;
      default:
    }

    this.commandList.push(command);
    this.detailList.push(...details!);

    this.setCurrentDate(command.createdAt);
    return this;
  }

  /**
   * 포인트 적립
   * @param amount 적립금액
   * @param expirationAt 만료일자
   */
  add(
    amount: PointAmount,
    expirationAt: Date,
  ) {
    const command = PointCommand.create({
      type: 'add',
      expirationAt: expirationAt,
      amount: amount,
    });

    return this.execute(command);
  }

  /**
   * 포인트 사용
   * @param amount 사용 금액
   * @param transactionId 거래번호
   */
  use(
    amount: PointAmount,
    transactionId: bigint,
  ) {
    const command = PointCommand.create({
      type: 'use',
      transactionId: transactionId,
      amount: amount,
    });
    return this.execute(command);
  }

  /**
   * 포인트 사용 취소
   * @param amount 취소금액
   * @param transactionId 거래번호
   */
  refund(
    amount: PointAmount,
    transactionId: bigint,
  ) {
    const command = PointCommand.create({
      type: 'refund',
      amount: amount,
      transactionId: transactionId,
    });

    return this.execute(command);
  }

  private createUsedList(
    log: PointCommand,
  ) {
    const addedGroups = MapUtil.groupBy(
      this.detailList,
      t => t.addedDetail.id.toString(),
    );
    let needAmount: number = log.amount;

    return Object
      .entries(addedGroups)
      .filter(
        ([addedId, groups]) => {
          const balanceAmount = groups.reduce(
            (
              acc,
              t,
            ) => acc + t.signedAmount,
            0,
          );

          return balanceAmount > 0;
        },
      )
      .sort(
        (
          [addedId1, groups1],
          [addedId2, groups2],
        ) => {
          const expiration1 = groups1[0].addedDetail.expirationAt!.getTime();
          const expiration2 = groups2[0].addedDetail.expirationAt!.getTime();

          // 유효기간이 짧은 포인트를 먼저 사용
          return expiration1 - expiration2;
        },
      )
      .reduce(
        (
          acc,
          [detailId, group],
        ) => {
          if (needAmount === 0) {
            return acc;
          }

          const balanceAmount = group.reduce(
            (
              acc,
              t,
            ) => acc + t.signedAmount,
            0,
          );
          const useAmount = Math.min(needAmount, balanceAmount);
          needAmount -= useAmount;

          acc.push(
            PointUsedDetail.create(
              log.transactionId!,
              group[0].addedDetail,
              PointAmount.of(useAmount),
            ),
          );

          return acc;
        },
        [] as PointDetail[],
      );
  }

  private createRefundList(
    log: PointCommand,
  ) {
    const result: PointRefundDetail[] = [];
    let needAmount: number = log.amount;
    const sameUsedList = this
      .detailList
      .filter(
        t => t.transactionId === log.transactionId,
      )
    ;
    const groupingList = MapUtil.groupBy(
      sameUsedList,
      t => t.addedDetail.id.toString(),
    );

    Object
      .entries(groupingList)
      .filter(
        ([t, list]) => list.reduce((
          sum,
          t,
        ) => sum + t.signedAmount, 0) !== 0,
      )
      .sort(
        (
          t1,
          t2,
        ) => {
          return t2[1][0].addedDetail.expirationAt!.getTime() - t1[1][0].addedDetail.expirationAt!.getTime();
        },
      )
      .forEach(
        (t1) => {
          if (needAmount === 0) {
            return;
          }
          const balance = Math.abs(
            t1[1].reduce((
              sum,
              t,
            ) => sum + t.signedAmount, 0),
          );

          const refund = Math.min(needAmount, balance);
          needAmount -= refund;
          result.push(
            PointRefundDetail.create(
              PointAmount.of(refund),
              log.transactionId!,
              t1[1][0].addedDetail!,
            ),
          );
        },
      )
    ;

    return result;

  }

  private syncExpired() {
    const logGroup = MapUtil.groupBy(this.detailList, t => t.addedDetail.id.toString());
    const expiredTarget = Object
      .entries(logGroup)
      .filter(([logId, detailList]) => {
        const expirationAt = detailList[0].addedDetail.expirationAt!.getTime();
        const currentTime = this.currentDate.getTime();

        if (expirationAt > currentTime) {
          return false;
        }

        const balance = detailList.reduce(
          (
            acc,
            t,
          ) => acc + t.signedAmount,
          0,
        );

        return balance > 0;
      });

    expiredTarget.map(
      ([logId, detailList]) => {
        const balance = detailList.reduce(
          (
            acc,
            t,
          ) => acc + t.signedAmount,
          0,
        );

        const detail = PointExpiredDetail.create(
          PointAmount.of(balance),
          detailList[0].addedDetail,
        );
        this.detailList.push(detail);
      },
    );
  }

}

