import type {Schema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {AnySchema, ValidationError} from 'joi';

import {register} from '../registry';
import {maybe} from '../utils';

type JoiSchema<T> = AnySchema<T>;

interface JoiResolver extends TypeSchemaResolver {
  base: JoiSchema<this['type']>;
  input: this['schema'] extends AnySchema<infer T> ? T : never;
  output: this['schema'] extends AnySchema<infer T> ? T : never;
  error: ValidationError;
}

declare global {
  export interface TypeSchemaRegistry {
    joi: JoiResolver;
  }
}

register(async <T>(schema: Schema<T>) => {
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
});
