export type NaturalNumber<T extends number> =
  `${T}` extends `${string}.${string}`
    ? never
    : T

export type PositiveNumber<T extends number> =
  `${T}` extends `-${string}`
    ? never
    : T;
