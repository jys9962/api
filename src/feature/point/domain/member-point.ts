import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { MapUtil } from '@/common/util/map/map.util';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { PointDetail } from '@/feature/point/domain/internal/detail/point-detail';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@/feature/point/domain/internal/detail/point-used-detail';
import { PointExpiredDetail } from '@/feature/point/domain/internal/detail/point-expired-detail';
import { PointRefundDetail } from '@/feature/point/domain/internal/detail/point-refund-detail';

export class MemberPoint {

  readonly logList: PointLog[] = [];
  readonly detailList: PointDetail[] = [];

  constructor(
    private currentDate: Date,
  ) {}

  static create(currentDate: Date = new Date()) {
    return new MemberPoint(currentDate);
  }

  get current(): number {
    return this.logList.reduce(
      (
        acc,
        t,
      ) => acc + t.signedAmount,
      0,
    );
  }

  setCurrentDate(date: Date) {
    this.currentDate = date;

    this.syncExpired();

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
    const log = PointLog.create({
      expirationAt: expirationAt,
      type: 'add',
      amount: amount,
    });
    const detail = PointAddedDetail.create(log);

    this.logList.push(log);
    this.detailList.push(detail);

    return this;
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
    const log = PointLog.create({
      type: 'use',
      transactionId: transactionId,
      amount: amount,
    });
    const detailList = this.createUsedList(log);

    this.logList.push(log);
    this.detailList.push(...detailList);

    return this;
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
    const log = PointLog.create({
      type: 'refund',
      amount: amount,
      transactionId: transactionId,
    });

    const refundDetails = this.createRefundList(log);

    this.logList.push(log);
    this.detailList.push(...refundDetails);

    return this;
  }

  private createUsedList(
    log: PointLog,
  ) {
    const addedGroups = MapUtil.groupBy(
      this.detailList, t => t.addedDetail.id.toString(),
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
          const expiration1 = groups1[0].addedDetail.log.expirationAt!.getTime();
          const expiration2 = groups2[0].addedDetail.log.expirationAt!.getTime();

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
              log,
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
    log: PointLog
  ) {
    const groupByTransactionId = MapUtil.groupBy(
      this.detailList,
      t => t.usedDetail?.log.transactionId?.toString() || '',
    );
    let needAmount: number = log.amount;

    return Object
      .entries(groupByTransactionId)
      .filter(
        ([transactionId, list]) => {
          if (transactionId !== log.transactionId?.toString()) {
            return false;
          }
          const usedBalance = list.reduce((
            acc,
            t,
          ) => acc + t.signedAmount, 0);
          if (usedBalance === 0) {
            return false;
          }

          return true;
        },
      )
      .sort(
        (
          t1,
          t2,
        ) => {
          const expirationAt1 = t1[1][0].usedDetail!.addedDetail.log.expirationAt!.getTime();
          const expirationAt2 = t2[1][0].usedDetail!.addedDetail.log.expirationAt!.getTime();
          return expirationAt2 - expirationAt1;
        },
      )
      .map(([transactionId, list]) => {
        const usedBalance = Math.abs(
          list.reduce((
            acc,
            t,
          ) => acc + t.signedAmount, 0),
        );

        const refund = Math.min(needAmount, usedBalance);
        needAmount -= refund;

        return PointRefundDetail.create(
          PointAmount.of(refund),
          log,
          list[0].usedDetail!,
        );
      });
  }

  private syncExpired() {
    const logGroup = MapUtil.groupBy(this.detailList, t => t.addedDetail.id.toString());
    const expiredTarget = Object
      .entries(logGroup)
      .filter(([logId, detailList]) => {
        const expirationAt = detailList[0].addedDetail.log.expirationAt!.getTime();
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

        const log = PointLog.create({
          type: 'expired',
          amount: PointAmount.of(balance),
        });

        const detail = PointExpiredDetail.create(
          log,
          PointAmount.of(balance),
          detailList[0].addedDetail,
        );

        this.logList.push(log);
        this.detailList.push(detail);
      },
    );
  }
}
