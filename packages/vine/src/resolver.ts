import type {IfDefined, Resolver} from '@typeschema/core';
import type {BaseType} from '@vinejs/vine';
import type {Infer, InferInput} from '@vinejs/vine/types';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: IfDefined<BaseType<any, any, any>, '@vinejs/vine'>;
  input: this['schema'] extends this['base']
    ? InferInput<this['schema']>
    : never;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : never;
}
