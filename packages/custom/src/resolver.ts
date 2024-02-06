import type {Resolver} from '@typeschema/core';

type CustomSchema<T> = (data: unknown) => Promise<T> | T;

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: CustomSchema<any>;
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
