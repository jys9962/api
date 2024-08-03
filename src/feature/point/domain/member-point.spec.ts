import { MemberPoint } from '@/feature/point/domain/member-point';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { IdGenerator } from '@/common/id-generator/id-generator';

IdGenerator.init(1, new Date(2000, 0, 1));

describe('MemberPoint', () => {

  it('최초 0원', async function() {
    const memberPoint = MemberPoint.create();

    // 최초생성시 0원
    expect(memberPoint.current).toBe(0);
  });

  it('포인트 지급시 잔액 증가', async function() {
    const memberPoint = MemberPoint
      .create()
      .add(
        PointAmount.of(1000),
        new Date(2100, 0, 1),
      );

    expect(memberPoint.current).toBe(1000);
  });

  it('포인트 사용시 잔액 차감', async function() {
    const memberPoint = MemberPoint
      .create()
      .add(
        PointAmount.of(5000),
        new Date(2100, 0, 1),
      )
      .use(
        PointAmount.of(1000),
        1n,
      );

    expect(memberPoint.current).toBe(4000);
  });

  it('사용기한이 지나는 경우', async function() {
    const memberPoint = MemberPoint
      .create(
        new Date(2000, 0, 1),
      )
      .add(
        PointAmount.of(5000),
        new Date(2020, 0, 1),
      )
      .setCurrentDate(
        new Date(2020, 1, 1),
      );

    expect(memberPoint.current).toBe(0);
  });

  it('사용 후 취소', async function() {
    const memberPoint = MemberPoint
      .create()
      .add(
        PointAmount.of(5000),
        new Date(2100, 0, 1),
      )
      .use(
        PointAmount.of(3000),
        100n,
      )
      .refund(
        PointAmount.of(2000),
        100n,
      );

    expect(memberPoint.current).toBe(4000);
  });

  it('포인트 사용은 유효기간이 짧은순으로 사용됨', async function() {
    const memberPoint = MemberPoint
      .create(
        new Date(2000, 0, 1),
      )
      .add(
        PointAmount.of(1000),
        new Date(2000, 6, 1),
      )
      .add(
        PointAmount.of(2000),
        new Date(2000, 0, 1),
      )
      .add(
        PointAmount.of(3000),
        new Date(2000, 3, 1),
      )
      .use(
        PointAmount.of(500),
        1n,
      )
      .setCurrentDate(
        new Date(2000, 1, 1),
      )
    ;

    expect(memberPoint.current).toBe(4000);
  });

  it('포인트 사용 취소 후 유효기간이 복구됨', async function() {
    const memberPoint = MemberPoint
      .create(new Date(2000, 0, 1))
      .add(
        PointAmount.of(1000),
        new Date(2000, 6, 1),
      )
      .add(
        PointAmount.of(2000),
        new Date(2000, 3, 1),
      )
      .add(
        PointAmount.of(3000),
        new Date(2000, 5, 1),
      )
      .use(
        PointAmount.of(4000),
        1n,
      )
      .refund(
        PointAmount.of(4000),
        1n,
      )
      .setCurrentDate(
        new Date(2000, 4, 1),
      );

    expect(memberPoint.current).toBe(4000);
  });

  it('포인트 환불 후 유효기간이 긴 순으로 복구됨', async function() {
    const memberPoint = MemberPoint
      .create(new Date(2000, 0, 1))
      .add(
        PointAmount.of(1000),
        new Date(2000, 6, 1),
      )
      .add(
        PointAmount.of(2000),
        new Date(2000, 3, 1),
      )
      .add(
        PointAmount.of(3000),
        new Date(2000, 5, 1),
      )
      .use(
        PointAmount.of(4000),
        1n,
      )
      .refund(
        PointAmount.of(3500),
        1n,
      )
      .setCurrentDate(
        new Date(2000, 4, 1),
      );

    expect(memberPoint.current).toBe(4000)
  });
});
