import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {InferType, Schema} from 'yup';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface YupResolver extends Resolver {
  base: Schema<this['type']>;
  input: this['schema'] extends Schema ? InferType<this['schema']> : never;
  output: this['schema'] extends Schema ? InferType<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/yup'),
);

const coerce: Coerce<'yup'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  '__isYupSchema__' in schema &&
  !isTypeBoxSchema(schema) &&
  !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {ValidationError} = await fetchModule();
  return async (data: unknown) => {
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
});
