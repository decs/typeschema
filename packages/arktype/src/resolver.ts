import type {IfDefined, Resolver} from '@typeschema/core';
import type {Type} from 'arktype';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Type, 'arktype'>;
  input: this['schema'] extends this['base']
    ? this['schema']['inferIn']
    : unknown;
  output: this['schema'] extends this['base']
    ? this['schema']['infer']
    : unknown;
}
