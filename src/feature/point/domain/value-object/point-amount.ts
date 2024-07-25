import { BrandNumber } from '@/common/type/brand-type';

export type PointAmount = BrandNumber<'PointAmount'>

export namespace PointAmount {
  export const of = (
    value: number,
  ): PointAmount => {
    return Math.abs(value) as PointAmount;
  };
}
