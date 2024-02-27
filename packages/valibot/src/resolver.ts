import type {Resolver} from '@typeschema/core';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

export interface AdapterResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends this['base'] ? Input<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Output<this['schema']> : never;
}
