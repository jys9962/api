export type Timestamp = number & { _brand: 'Timestamp' }

export namespace Timestamp {
  export const of = (date: Date): Timestamp => {
    return date.getTime() as Timestamp;
  };

  export const sec = (value = 1): Timestamp => 1000 * value as Timestamp;
  export const min = (value = 1): Timestamp => sec(60) * value as Timestamp;
  export const hour = (value = 1): Timestamp => min(60) * value as Timestamp;
  export const day = (value = 1): Timestamp => hour(24) * value as Timestamp;
  export const week = (value = 1): Timestamp => day(7) * value as Timestamp;
}

