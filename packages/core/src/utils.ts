// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IfDefined<T> = any extends T ? never : T;

export type UnknownIfNever<T> = [T] extends [never] ? unknown : T;
