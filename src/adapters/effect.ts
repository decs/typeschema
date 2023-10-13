import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Schema} from '@effect/schema/Schema';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';

export interface EffectResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Schema<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: this['schema'] extends Schema<any>
    ? Schema.From<this['schema']>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Schema<any>
    ? Schema.To<this['schema']>
    : never;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {isRight} = await import(
    /* webpackIgnore: true */ '@effect/data/Either'
  );
  const {isSchema, parseEither} = await import(
    /* webpackIgnore: true */ '@effect/schema/Schema'
  );
  const {formatErrors} = await import(
    /* webpackIgnore: true */ '@effect/schema/TreeFormatter'
  );
  return {formatErrors, isRight, isSchema, parseEither};
});

const coerce: Coerce<'effect'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema => {
  return 'ast' in schema && !isJSONSchema(schema) && !isTypeBoxSchema(schema)
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
