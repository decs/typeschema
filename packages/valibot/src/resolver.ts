import type {IfDefined, Resolver} from '@typeschema/core';
import type {GenericSchema, GenericSchemaAsync, InferInput, InferOutput} from 'valibot';

export interface AdapterResolver extends Resolver {
  base: IfDefined<GenericSchema | GenericSchemaAsync, 'valibot'>;
  input: this['schema'] extends this['base'] ? InferInput<this['schema']> : never;
  output: this['schema'] extends this['base'] ? InferOutput<this['schema']> : never;
}
