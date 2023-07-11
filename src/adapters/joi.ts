import type {Schema, WrappedSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {AnySchema, ValidationError} from 'joi';

import {register} from '../registry';
import {maybe} from '../utils';

type JoiSchema<T> = AnySchema<T>;

interface JoiResolver extends TypeSchemaResolver {
  base: JoiSchema<this['type']>;
  input: this['schema'] extends JoiSchema<infer JoiType> ? JoiType : never;
  output: this['schema'] extends JoiSchema<infer JoiType> ? JoiType : never;
  error: ValidationError;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  const Joi = await maybe(() => import('joi'));
  if (Joi == null) {
    return null;
  }
  if (!('_flags' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies JoiSchema<T>;
  return {
    assert: async data => schema.validateAsync(data),
  };
}

declare global {
  export interface TypeSchemaRegistry {
    joi: JoiResolver;
  }
}
register(wrap);
