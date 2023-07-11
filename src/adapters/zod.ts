import type {Schema} from '../registry';
import type {InferSchema, TypeSchemaResolver} from '../resolver';
import type {input, output, ZodError, ZodSchema, ZodTypeAny} from 'zod';

import {register} from '../registry';
import {maybe} from '../utils';

interface ZodResolver extends TypeSchemaResolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodTypeAny ? input<this['schema']> : never;
  output: this['schema'] extends ZodTypeAny ? output<this['schema']> : never;
  error: ZodError;
}

declare global {
  export interface TypeSchemaRegistry {
    zod: ZodResolver;
  }
}

register(async <T>(schema: Schema<T>) => {
  const Zod = await maybe(() => import('zod'));
  if (Zod == null) {
    return null;
  }
  if (!('_def' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies InferSchema<ZodResolver, T>;
  return {
    assert: async data => schema.parse(data),
  };
});
