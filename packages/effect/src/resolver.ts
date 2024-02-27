import type {Schema} from '@effect/schema/Schema';
import type {Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Schema<any>;
  input: this['schema'] extends this['base']
    ? Schema.From<this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? Schema.To<this['schema']>
    : never;
}
