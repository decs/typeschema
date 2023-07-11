import type {Schema, WrappedSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {InferType, Schema as YupSchema, ValidationError} from 'yup';

import {register} from '../registry';
import {maybe} from '../utils';

interface YupResolver extends TypeSchemaResolver {
  base: YupSchema<this['type']>;
  input: this['schema'] extends YupSchema ? InferType<this['schema']> : never;
  output: this['schema'] extends YupSchema ? InferType<this['schema']> : never;
  error: ValidationError;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  const Yup = await maybe(() => import('yup'));
  if (Yup == null) {
    return null;
  }
  if (!('__isYupSchema__' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies YupSchema<T>;
  return {
    assert: async data => schema.validate(data, {strict: true}),
  };
}

declare global {
  export interface TypeSchemaRegistry {
    yup: YupResolver;
  }
}
register(wrap);
