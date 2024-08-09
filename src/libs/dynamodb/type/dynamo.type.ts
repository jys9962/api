export type PrimaryPK = { pk: string }
export type PrimarySK = { sk: string }
export type Primary = PrimaryPK & PrimarySK

export type SplitFormat<TFormat extends string> =
  TFormat extends `${infer K}#${infer X}`
    ? SplitFormat<K> | SplitFormat<X>
    : TFormat

type OnlyBrace<T extends string> =
  T extends `{${infer K}}`
    ? K
    : never

export type FormatKeys<T extends string> =
  OnlyBrace<SplitFormat<T>>

export type FormatObject<T extends string> =
  Record<FormatKeys<T>, string>

export namespace Dynamo {
  export type Key<T> = string & { _key: T }
}
