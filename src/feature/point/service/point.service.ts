import { Injectable } from '@nestjs/common';
import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { MemberPointRepository } from '@/feature/point/domain/member-point.repository';

@Injectable()
export class PointService {

  constructor(
    private readonly memberPointRepository: MemberPointRepository,
  ) {}

  async get(
    memberId: bigint,
  ): Promise<PointAmount> {
    const memberPoint = await this.memberPointRepository.find(memberId);

    return memberPoint.balance;
  }

  async add(
    memberId: bigint,
    amount: number,
    expirationAt: Date,
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);

    memberPoint.add(
      PointAmount.of(amount),
      expirationAt,
    );

    await this.memberPointRepository.save(memberId, memberPoint);
  }

  async use(
    memberId: bigint,
    amount: number,
    transactionId: bigint,
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);

    memberPoint.use(
      PointAmount.of(amount),
      transactionId,
    );

    await this.memberPointRepository.save(memberId, memberPoint);
  }

  async refund(
    memberId: bigint,
    amount: number,
    transactionId: bigint,
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);

    memberPoint.refund(
      PointAmount.of(amount),
      transactionId,
    );

    await this.memberPointRepository.save(memberId, memberPoint);
  }
}
