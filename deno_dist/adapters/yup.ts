import type {Resolver} from '../resolver.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {InferType, Schema} from 'npm:yup@1.2.0';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

export interface YupResolver extends Resolver {
  base: Schema<this['type']>;
  input: this['schema'] extends Schema ? InferType<this['schema']> : never;
  output: this['schema'] extends Schema ? InferType<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/yup.ts'),
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
            {
              message,
              path: path != null && path !== '' ? [path] : undefined,
            },
          ],
        };
      }
      throw error;
    }
  };
});
