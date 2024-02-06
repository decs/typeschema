import type {Type} from '@deepkit/type';
import type {Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: Type;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}
