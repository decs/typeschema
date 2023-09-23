import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Static, TSchema} from '@sinclair/typebox';

import {isTypeBoxSchema, memoize} from '../utils';

export interface TypeBoxResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {TypeCompiler} =
    require('@sinclair/typebox/compiler') as typeof import('@sinclair/typebox/compiler');
  return {TypeCompiler};
});

const coerce: Coerce<'typebox'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  isTypeBoxSchema(schema) ? fn(schema) : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {TypeCompiler} = await fetchModule();
  const result = TypeCompiler.Compile(schema);
  return async (data: unknown): Promise<ValidationResult> => {
    if (result.Check(data)) {
      return {
        data,
        success: true,
      };
    }
    return {
      issues: [...result.Errors(data)].map(({message, path}) => ({
        message,
        path: [path],
      })),
      success: false,
    };
  };
});
