import type {IfDefined, Resolver} from '@typeschema/core';
import type {SchemaObject} from 'ajv';

export interface AdapterResolver extends Resolver {
  base: IfDefined<SchemaObject, 'ajv'>;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}
