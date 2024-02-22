import type {Resolver} from '@typeschema/core';
import type {SchemaObject} from 'ajv';

export interface AdapterResolver extends Resolver {
  base: SchemaObject;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}
