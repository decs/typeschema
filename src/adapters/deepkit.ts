import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Type} from '@deepkit/type';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';

export interface DeepkitResolver extends Resolver {
  base: Type;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {validate} = require('@deepkit/type') as typeof import('@deepkit/type');
  return {validate};
});

const coerce: Coerce<'deepkit'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'kind' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {validate} = await fetchModule();
  return async (data: unknown): Promise<ValidationResult> => {
    const result = validate(data, schema);
    if (result.length === 0) {
      return {
        data,
        success: true,
      };
    }
    return {
      issues: result.map(({message, path}) => ({message, path: [path]})),
      success: false,
    };
  };
});
