export namespace BigIntMath {

  export const min = (...values: bigint[]): bigint => {
    if (values.length === 0) {
      throw new Error('No arguments provided');
    }

    return values
      .reduce(
        (
          min,
          t,
        ) => min > t ? t : min,
        values[0],
      );
  };

  export const max = (...values: bigint[]): bigint => {
    if (values.length === 0) {
      throw new Error('No arguments provided');
    }

    return values
      .reduce(
        (
          max,
          t,
        ) => t > max ? t : max,
        values[0],
      );
  };

}
