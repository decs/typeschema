import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {From, Schema, To} from 'npm:@effect/schema@0.33.2/Schema';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

export interface EffectResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Schema<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: this['schema'] extends Schema<any> ? From<this['schema']> : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Schema<any> ? To<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/effect.ts'),
);

const coerce: Coerce<'effect'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema => {
  return '_id' in schema && !isJSONSchema(schema) && !isTypeBoxSchema(schema)
    ? fn(schema)
    : undefined;
};

export const createValidate: CreateValidate = coerce(async schema => {
  const {parseEither, isRight, formatErrors} = await fetchModule();
  const parseSchema = parseEither(schema);
  return async (data: unknown): Promise<ValidationResult> => {
    const result = parseSchema(data);
    if (isRight(result)) {
      return {
        data: result.right,
        success: true,
      };
    }
    return {
      issues: result.left.errors.map(error => ({
        message: formatErrors([error]),
      })),
      success: false,
    };
  };
});
