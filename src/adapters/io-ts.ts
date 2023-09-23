import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Any, OutputOf, TypeOf} from 'io-ts';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';

export interface IoTsResolver extends Resolver {
  base: Any;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never;
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {isRight} = require('fp-ts/Either') as typeof import('fp-ts/Either');
  return {isRight};
});

const coerce: Coerce<'io-ts'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'encode' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {isRight} = await fetchModule();
  return async (data: unknown): Promise<ValidationResult> => {
    const result = schema.decode(data);
    if (isRight(result)) {
      return {
        data: result.right,
        success: true,
      };
    }
    return {
      issues: result.left.map(({message, context}) => ({
        message: message ?? '',
        path: context.map(({key}) => key),
      })),
      success: false,
    };
  };
});
