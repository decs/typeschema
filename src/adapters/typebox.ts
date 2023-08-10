import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Static, TSchema} from '@sinclair/typebox';

import {isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface TypeBoxResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/typebox'),
);

const coerce: Coerce<'typebox'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  isTypeBoxSchema(schema) ? fn(schema) : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {TypeCompiler} = await fetchModule();
  const result = TypeCompiler.Compile(schema);
  return async (data: unknown) => {
    if (result.Check(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: [...result.Errors(data)].map(
        ({message, path}) => new ValidationIssue(message, [path]),
      ),
    };
  };
});
