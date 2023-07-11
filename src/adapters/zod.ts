import type {Schema, TypeSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {input, output, ZodError, ZodSchema, ZodTypeAny} from 'zod';

import {register} from '../registry';
import {maybe} from '../utils';

interface ZodResolver extends TypeSchemaResolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodTypeAny ? input<this['schema']> : never;
  output: this['schema'] extends ZodTypeAny ? output<this['schema']> : never;
  error: ZodError;
}

async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T> | null> {
  const Zod = await maybe(() => import('zod'));
  if (Zod == null) {
    return null;
  }
  if (!('_def' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies ZodSchema<T>;
  return {
    assert: async data => schema.parse(data),
  };
}

declare global {
  export interface TypeSchemaRegistry {
    zod: ZodResolver;
  }
}
register(wrap);
