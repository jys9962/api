export type Email = string & { _brand: 'Email ' }

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
