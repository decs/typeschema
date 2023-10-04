import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Type} from 'npm:@deepkit/type@1.0.1-alpha.97';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

export interface DeepkitResolver extends Resolver {
  base: Type;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {validate} = await import('npm:@deepkit/type@1.0.1-alpha.97');
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
