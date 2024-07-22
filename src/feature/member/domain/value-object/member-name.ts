import { BrandString } from '@/common/type/brand-string';

export type MemberName = BrandString<'MemberName'>;

export namespace MemberName {

  const isValid = (value: string): value is MemberName => true;

  export const from = (value: string): MemberName => {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  };
}