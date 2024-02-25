import type {Resolver} from '@typeschema/core';

type Prettify<T> = {[K in keyof T]: T[K]} & NonNullable<unknown>;

type Attributes<T> = Prettify<
  Omit<
    T,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {[K in keyof T]: T[K] extends Function ? K : never}[keyof T]
  >
>;

export interface AdapterResolver extends Resolver {
  base: new (...args: unknown[]) => object;
  input: this['schema'] extends this['base']
    ? this['schema'] extends {prototype: unknown}
      ? Attributes<this['schema']['prototype']>
      : never
    : never;
  output: this['schema'] extends this['base']
    ? this['schema'] extends {prototype: unknown}
      ? Attributes<this['schema']['prototype']>
      : never
    : never;
}
