import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {InferType, Schema} from 'yup';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

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

export const init: Adapter<'yup'>['init'] = async () =>
  maybe(() => import('yup'));

export const guard: Adapter<'yup'>['guard'] = schema =>
  '__isYupSchema__' in schema &&
  !isTypeBoxSchema(schema) &&
  !isJSONSchema(schema)
    ? schema
    : null;

export const validate: Adapter<'yup'>['validate'] =
  (schema, {ValidationError}) =>
  async data => {
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
  };
