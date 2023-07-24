import type {Resolver} from '../resolver';
import type {InferType, Schema} from 'yup';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, maybe} from '../utils';

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
  async schema => {
    const Yup = await maybe(() => import('yup'));
    if (Yup == null) {
      return null;
    }
    if (
      !('__isYupSchema__' in schema) ||
      'static' in schema ||
      isJSONSchema(schema)
    ) {
      return null;
    }
    return schema;
  },
  async schema => ({
    validate: async data => {
      try {
        return {data: await schema.validate(data, {strict: true})};
      } catch (error) {
        const Yup = await import('yup');
        if (error instanceof Yup.ValidationError) {
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
);
