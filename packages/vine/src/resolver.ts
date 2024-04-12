import type {IfDefined, Resolver} from '@typeschema/core';
import type {BaseType, symbols} from '@vinejs/vine';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: IfDefined<BaseType<any, any, any>, '@vinejs/vine'>;
  input: this['schema'] extends this['base']
    ? this['schema'][typeof symbols.ITYPE]
    : never;
  output: this['schema'] extends this['base']
    ? this['schema'][typeof symbols.OTYPE]
    : never;
}
