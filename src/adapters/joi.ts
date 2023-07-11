import type {TypeSchemaResolver} from '../resolver';
import type {AnySchema, ValidationError} from 'joi';

import {register} from '../registry';
import {maybe} from '../utils';

interface JoiResolver extends TypeSchemaResolver {
  base: AnySchema<this['type']>;
  input: this['schema'] extends AnySchema<infer T> ? T : never;
  output: this['schema'] extends AnySchema<infer T> ? T : never;
  error: ValidationError;
}

declare global {
  export interface TypeSchemaRegistry {
    joi: JoiResolver;
  }
}

register<JoiResolver>(
  async schema => {
    const Joi = await maybe(() => import('joi'));
    if (Joi == null) {
      return null;
    }
    if (!('_flags' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    assert: async data => schema.validateAsync(data),
  }),
);
