import type {Resolver} from '@typeschema/core';
import type {Runtype, Static} from 'runtypes';

export interface AdapterResolver extends Resolver {
  base: Runtype;
  input: this['schema'] extends this['base'] ? Static<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Static<this['schema']> : never;
}
