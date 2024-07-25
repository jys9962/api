export type BrandString<T extends string> = string & { _brand: T }
export type BrandBigInt<T extends string> = bigint & { _brand: T }
export type BrandNumber<T extends string> = number & { _brand: T }
