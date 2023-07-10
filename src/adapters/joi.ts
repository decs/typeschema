import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';
import type {AnySchema, ValidationError} from 'joi';

import {maybe} from '../utils';
import {registerAdapter} from './adapter-registry';

type JoiSchema<T> = AnySchema<T>;

declare global {
  export interface SchemaAdapterRegistry {
    joi: JoiResolver;
  }
}
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

registerAdapter(wrap);
