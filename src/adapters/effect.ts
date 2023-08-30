import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type * as Schema from '@effect/schema/Schema';

import { isJSONSchema, isTypeBoxSchema, memoize } from '../utils';

export interface EffectResolver extends Resolver {
  base: Schema.Schema<this['type']>;
  input: this['schema'] extends Schema.Schema<any> ? Schema.From<this['schema']> : never;
  output: this['schema'] extends Schema.Schema<any> ? Schema.To<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/effect'),
);

const coerce: Coerce<'effect'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema => {
  return "_id" in schema && !isJSONSchema(schema) && !isTypeBoxSchema(schema)
    ? fn(schema)
    : undefined;
}

export const createValidate: CreateValidate = coerce(async schema => {
  const { parseEither, isRight, formatErrors } = await fetchModule();
  const parse = parseEither(schema);
  return async (data: unknown) => {
    const result = parse(data);
    if (isRight(result)) {
      return {data: result.right};
    }
    return {
      issues: result.left.errors.map((r) => ({
        message: formatErrors([r])
      })),
    };
  };
});
