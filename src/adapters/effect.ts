import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type * as S from '@effect/schema/Schema';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';

export interface EffectResolver extends Resolver {
  base: S.Schema<this['type']>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: this['schema'] extends S.Schema<any> ? S.From<this['schema']> : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends S.Schema<any> ? S.To<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/effect'),
);

const coerce: Coerce<'effect'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema => {
  return '_id' in schema && !isJSONSchema(schema) && !isTypeBoxSchema(schema)
    ? fn(schema)
    : undefined;
};

export const createValidate: CreateValidate = coerce(async schema => {
  const {parseEither, isRight, formatErrors} = await fetchModule();
  const parseSchema = parseEither(schema);
  return async (data: unknown) => {
    const result = parseSchema(data);
    if (isRight(result)) {
      return {data: result.right};
    }
    return {
      issues: result.left.errors.map(error => ({
        message: formatErrors([error]),
      })),
    };
  };
});
