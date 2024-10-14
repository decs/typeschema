import type {IfDefined, Resolver} from '@typeschema/core';
import type {Infer, Struct} from 'superstruct';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: IfDefined<Struct<any, any>, 'superstruct'>;
  input: unknown;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : unknown;
}
