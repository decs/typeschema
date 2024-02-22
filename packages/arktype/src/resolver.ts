import type {Resolver} from '@typeschema/core';
import type {Type} from 'arktype';

export interface AdapterResolver extends Resolver {
  base: Type;
  input: this['schema'] extends this['base']
    ? this['schema']['inferIn']
    : never;
  output: this['schema'] extends this['base'] ? this['schema']['infer'] : never;
}
