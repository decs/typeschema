import type {IfDefined, Resolver} from '@typeschema/core';
import type {FromSchema, JSONSchema} from 'json-schema-to-ts';

export interface AdapterResolver extends Resolver {
  base: IfDefined<JSONSchema, 'json-schema-to-ts'>;
  input: this['schema'] extends this['base']
    ? FromSchema<this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? FromSchema<this['schema']>
    : never;
}
