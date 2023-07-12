import type {TypeSchemaResolver} from '../resolver';
import type {
  InferType,
  Schema as YupSchema,
  ValidationError as YupValidationError,
} from 'yup';

import {register} from '../registry';
import {ValidationError} from '../schema';
import {maybe} from '../utils';

interface YupResolver extends TypeSchemaResolver {
  base: YupSchema<this['type']>;
  input: this['schema'] extends YupSchema ? InferType<this['schema']> : never;
  output: this['schema'] extends YupSchema ? InferType<this['schema']> : never;
  error: YupValidationError;
}

declare global {
  export interface TypeSchemaRegistry {
    yup: YupResolver;
  }
}

register<'yup'>(
  async schema => {
    const Yup = await maybe(() => import('yup'));
    if (Yup == null) {
      return null;
    }
    if (!('__isYupSchema__' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    validate: async data => {
      try {
        return {
          valid: true,
          value: await schema.validate(data, {strict: true}),
        };
      } catch (error) {
        const Yup = await import('yup');
        if (error instanceof Yup.ValidationError) {
          const {message, path} = error;
          return {
            errors: [
              new ValidationError(
                message,
                path != null && path !== '' ? [path] : undefined,
              ),
            ],
            valid: false,
          };
        }
        throw error;
      }
    },
  }),
);
