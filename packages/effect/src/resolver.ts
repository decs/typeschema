import type {Schema} from '@effect/schema/Schema';
import type {IfDefined, Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Schema.AnyNoContext, '@effect/schema'>;
  input: this['schema'] extends this['base']
    ? Schema.Encoded<this['schema']>
    : unknown;
  output: this['schema'] extends this['base']
    ? Schema.Type<this['schema']>
    : unknown;
}
