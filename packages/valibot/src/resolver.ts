import type {Resolver} from '@typeschema/core';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';
import type {toJSONSchema} from '@gcornut/valibot-json-schema';

export interface AdapterResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends this['base'] ? Input<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Output<this['schema']> : never;
  jsonSchema: ReturnType<typeof toJSONSchema>;
}
