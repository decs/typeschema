import type {IfDefined, Resolver} from '@typeschema/core';
import type {CoreValidator, TypeOf} from 'suretype';

export interface AdapterResolver extends Resolver {
  base: IfDefined<CoreValidator<unknown>, 'suretype'>;
  input: this['schema'] extends this['base'] ? TypeOf<this['schema']> : unknown;
  output: this['schema'] extends this['base']
    ? TypeOf<this['schema']>
    : unknown;
}
