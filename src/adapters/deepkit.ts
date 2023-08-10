import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Type} from '@deepkit/type';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface DeepkitResolver extends Resolver {
  base: Type;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/deepkit'),
);

const coerce: Coerce<'deepkit'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'kind' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {validate} = await fetchModule();
  return async (data: unknown) => {
    const result = validate(data, schema);
    if (result.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: result.map(
        ({message, path}) => new ValidationIssue(message, [path]),
      ),
    };
  };
});
