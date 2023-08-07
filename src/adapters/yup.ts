import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {InferType, Schema} from 'yup';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface YupResolver extends Resolver {
  base: Schema<this['type']>;
  input: this['schema'] extends Schema ? InferType<this['schema']> : never;
  output: this['schema'] extends Schema ? InferType<this['schema']> : never;
}

const fetchModule = memoize(async () => {
  const {ValidationError} = await import('yup');
  return {ValidationError};
});

export const coerce: Adapter<'yup'>['coerce'] = schema =>
  '__isYupSchema__' in schema &&
  !isTypeBoxSchema(schema) &&
  !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'yup'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {ValidationError} = await fetchModule();
    return async data => {
      try {
        return {data: await coercedSchema.validate(data, {strict: true})};
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
  };
