import type {IfDefined, Resolver} from '@typeschema/core';
import type {BaseIssue, BaseSchema, BaseSchemaAsync, InferInput, InferOutput} from 'valibot';

export interface AdapterResolver extends Resolver {
  base: IfDefined<BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>, 'valibot'>;
  input: this['schema'] extends this['base'] ? InferInput<this['schema']> : never;
  output: this['schema'] extends this['base'] ? InferOutput<this['schema']> : never;
}
