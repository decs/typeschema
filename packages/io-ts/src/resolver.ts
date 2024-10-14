import type {IfDefined, Resolver} from '@typeschema/core';
import type {Any, OutputOf, TypeOf} from 'io-ts';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Any, 'io-ts'>;
  input: this['schema'] extends this['base']
    ? OutputOf<this['schema']>
    : unknown;
  output: this['schema'] extends this['base']
    ? TypeOf<this['schema']>
    : unknown;
}
