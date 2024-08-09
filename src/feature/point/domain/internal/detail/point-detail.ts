import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';

export interface PointDetail {
  id: bigint;
  amount: PointAmount;
  addedDetail: PointAddedDetail;

  transactionId: bigint | undefined;
  signedAmount: number;
}
