import type {Resolver} from '../resolver';
import type {Adapter} from '.';

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

export const coerce: Adapter<'function'>['coerce'] = schema =>
  typeof schema === 'function' && !('assert' in schema) ? schema : null;

export const createValidate: Adapter<'function'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    return async data => {
      try {
        return {data: await coercedSchema(data)};
      } catch (error) {
        if (error instanceof Error) {
          return {issues: [new ValidationIssue(error.message)]};
        }
        throw error;
      }
    };
  };
