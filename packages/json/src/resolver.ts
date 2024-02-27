import type {IfDefined, Resolver} from '@typeschema/core';
import type {SchemaObject} from 'ajv';
import type {FromSchema} from 'json-schema-to-ts';

export interface AdapterResolver extends Resolver {
  base: IfDefined<SchemaObject, 'ajv'>;
  input: this['schema'] extends this['base']
    ? IfDefined<FromSchema<this['schema']>, 'json-schema-to-ts'>
    : never;
  output: this['schema'] extends this['base']
    ? IfDefined<FromSchema<this['schema']>, 'json-schema-to-ts'>
    : never;
}
