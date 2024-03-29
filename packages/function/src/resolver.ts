import type {Resolver} from '@typeschema/core';

type FunctionSchema<T> = (data: unknown) => Promise<T> | T;

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: FunctionSchema<any>;
  input: this['schema'] extends this['base']
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
  output: this['schema'] extends this['base']
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
}
