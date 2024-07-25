import { BrandString } from '@/common/type/brand-type';

export type Email = BrandString<'Email'>;

export namespace Email {

  const isValid = (value: string): value is Email => {
    return true;
  };

  export const from = (value: string): Email => {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  };
}
