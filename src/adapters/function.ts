import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';

import {ValidationIssue} from '../validation';

type FunctionSchema<T = unknown> = (data: unknown) => Promise<T> | T;

export interface FunctionResolver extends Resolver {
  base: FunctionSchema<this['type']>;
  input: this['schema'] extends FunctionSchema
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
  output: this['schema'] extends FunctionSchema
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
}

const coerce: Coerce<'function'> = fn => async schema =>
  typeof schema === 'function' && !('assert' in schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async data => {
    try {
      return {data: await schema(data)};
    } catch (error) {
      if (error instanceof Error) {
        return {issues: [new ValidationIssue(error.message)]};
      }
      throw error;
    }
  },
);
