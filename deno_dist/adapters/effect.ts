import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Schema} from 'npm:@effect/schema@0.36.5/Schema';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

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
  const {isRight} =
    require('@effect/data/Either') as typeof import('npm:@effect/data@0.18.6/Either');
  const {isSchema, parseEither} =
    require('@effect/schema/Schema') as typeof import('npm:@effect/schema@0.36.5/Schema');
  const {formatErrors} =
    require('@effect/schema/TreeFormatter') as typeof import('npm:@effect/schema@0.36.5/TreeFormatter');
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
