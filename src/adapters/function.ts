import type {TypeSchemaResolver} from '../resolver';

import {register} from '../registry';
import {ValidationIssue} from '../schema';

interface FunctionSchema<T = unknown> {
  (data: unknown): Promise<T> | T;
}

interface FunctionResolver extends TypeSchemaResolver {
  base: FunctionSchema<unknown>;
  input: this['schema'] extends FunctionSchema<infer Type>
    ? this['schema'] extends FunctionSchema & {inferIn: unknown} // dont infer as function if arktype
      ? never
      : Type
    : never;
  output: this['schema'] extends FunctionSchema<infer Type>
    ? this['schema'] extends FunctionSchema & {infer: unknown} // dont infer as function if arktype
      ? never
      : Type
    : never;
  error: unknown;
}

declare global {
  export interface TypeSchemaRegistry {
    function: FunctionResolver;
  }
}

register<'function'>(
  async schema => {
    if (typeof schema !== 'function' || 'assert' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    validate: async data => {
      try {
        return {data: (await schema(data)) as any};
      } catch (error) {
        if (error instanceof Error) {
          return {issues: [new ValidationIssue(error.message)]};
        }
        throw error;
      }
    },
  }),
);
