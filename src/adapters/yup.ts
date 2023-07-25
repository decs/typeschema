import type {Resolver} from '../resolver';
import type {InferType, Schema} from 'yup';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface YupResolver extends Resolver {
  base: Schema<this['type']>;
  input: this['schema'] extends Schema ? InferType<this['schema']> : never;
  output: this['schema'] extends Schema ? InferType<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    yup: YupResolver;
  }
}

register<'yup'>(
  schema => {
    if (
      !('__isYupSchema__' in schema) ||
      isTypeBoxSchema(schema) ||
      isJSONSchema(schema)
    ) {
      return null;
    }
    return schema;
  },
  async schema => {
    const {ValidationError} = await import('yup');
    return {
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
    };
  },
  () => import('yup'),
);
