import type {IfDefined, Resolver} from '@typeschema/core';
import type {Type} from 'arktype';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: IfDefined<Type<any>, 'arktype'>;
  input: this['schema'] extends this['base']
    ? this['schema']['inferIn']
    : never;
  output: this['schema'] extends this['base'] ? this['schema']['infer'] : never;
}
