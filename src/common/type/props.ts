export type Props<T> = Pick<T, PropKeys<T>>

export type PropKeys<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key
}[keyof T]
