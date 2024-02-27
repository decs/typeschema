import type {Resolver} from '@typeschema/core';
import type {Infer, Predicate} from 'ow';

export interface AdapterResolver extends Resolver {
  base: Predicate;
  input: this['schema'] extends this['base'] ? Infer<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : never;
}
