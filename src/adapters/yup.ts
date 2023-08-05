import type {Resolver} from '../resolver';
import type {InferType, Schema} from 'yup';

import {ValidationIssue} from '../api/schema';
import {register} from '../registry';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface YupResolver extends Resolver {
  base: Schema<this['type']>;
  input: this['schema'] extends Schema ? InferType<this['schema']> : never;
  output: this['schema'] extends Schema ? InferType<this['schema']> : never;
  module: typeof import('yup');
}

declare global {
  export interface TypeSchemaRegistry {
    yup: YupResolver;
  }
}

register<'yup'>(
  schema =>
    '__isYupSchema__' in schema &&
    !isTypeBoxSchema(schema) &&
    !isJSONSchema(schema)
      ? schema
      : null,
  async (schema, {ValidationError}) => ({
    validate: async data => {
      try {
        return {data: await schema.validate(data, {strict: true})};
      } catch (error) {
        if (error instanceof ValidationError) {
          const {message, path} = error;
          return {
            issues: [
              new ValidationIssue(
                message,
                path != null && path !== '' ? [path] : undefined,
              ),
            ],
          };
        }
        throw error;
      }
    },
  }),
  'yup',
);
