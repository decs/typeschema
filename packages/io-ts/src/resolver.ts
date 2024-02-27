import type {Resolver} from '@typeschema/core';
import type {Any, OutputOf, TypeOf} from 'io-ts';

export interface AdapterResolver extends Resolver {
  base: Any;
  input: this['schema'] extends this['base'] ? OutputOf<this['schema']> : never;
  output: this['schema'] extends this['base'] ? TypeOf<this['schema']> : never;
}
