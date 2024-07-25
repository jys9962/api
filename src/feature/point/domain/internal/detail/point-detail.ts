import { PointAmount } from '@/feature/point/domain/value-object/point-amount';
import { PointLog } from '@/feature/point/domain/internal/log/point-log';
import { PointAddedDetail } from '@/feature/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@/feature/point/domain/internal/detail/point-used-detail';

export interface PointDetail {
  id: bigint;
  amount: PointAmount;
  log: PointLog;

  addedDetail: PointAddedDetail;
  usedDetail: PointUsedDetail | null;

  signedAmount: number;
}
