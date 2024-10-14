import type {IfDefined, Resolver} from '@typeschema/core';
import type {Infer, Predicate} from 'ow';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Predicate, 'ow'>;
  input: this['schema'] extends this['base'] ? Infer<this['schema']> : unknown;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : unknown;
}
