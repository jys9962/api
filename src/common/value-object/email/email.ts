export type Email = string & { _brand: 'Email ' }

export namespace Email {

  function isValid(value: string): value is Email {
    return true;
  }

  export function from(value: string): Email {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  }
}
