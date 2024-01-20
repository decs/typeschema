import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Schema} from 'npm:@effect/schema@0.60.6/Schema';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

export interface EffectResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Schema<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: this['schema'] extends Schema<any, any>
    ? Schema.From<this['schema']>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Schema<any, any>
    ? Schema.To<this['schema']>
    : never;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  try {
    const {isRight} = await import(/* webpackIgnore: true */ 'effect/Either');
    const {isSchema, parseEither} = await import(
      /* webpackIgnore: true */ '@effect/schema/Schema'
    );
    const {formatError} = await import(
      /* webpackIgnore: true */ '@effect/schema/TreeFormatter'
    );
    return {formatError, isRight, isSchema, parseEither};
  } catch (error) {
    throw error;
  }
});

const coerce: Coerce<'effect'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema => {
  return 'ast' in schema && !isJSONSchema(schema) && !isTypeBoxSchema(schema)
    ? fn(schema)
    : undefined;
};

export const createValidate: CreateValidate = coerce(async schema => {
  const {parseEither, isRight, formatError} = await fetchModule();
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
      issues: [{message: formatError(result.left)}],
      success: false,
    };
  };
});
