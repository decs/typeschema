import type {Resolver} from '@typeschema/core';
import type {Infer, Struct} from 'superstruct';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Struct<any, any>;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : never;
}
