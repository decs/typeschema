import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';
import type {input, output, ZodError, ZodSchema, ZodTypeAny} from 'zod';

import {maybe} from '../utils';
import {registerAdapter} from './adapter-registry';

declare global {
  export interface SchemaAdapterRegistry {
    zod: ZodResolver;
  }
}

interface ZodResolver extends TypeSchemaResolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodTypeAny ? input<this['schema']> : never;
  output: this['schema'] extends ZodTypeAny ? output<this['schema']> : never;
  error: ZodError;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
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

registerAdapter(wrap);
