import type {IfDefined, Resolver} from '@typeschema/core';
import type {Runtype, Static} from 'runtypes';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Runtype, 'runtypes'>;
  input: this['schema'] extends this['base'] ? Static<this['schema']> : unknown;
  output: this['schema'] extends this['base']
    ? Static<this['schema']>
    : unknown;
}
