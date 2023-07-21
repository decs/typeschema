import type {Resolver} from '../resolver';

import {register} from '../registry';
import {Source, ValidationIssue} from '../schema';

type FunctionSchema<T = unknown> = (data: unknown) => Promise<T> | T;

interface FunctionResolver extends Resolver {
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
  async schema => ({
    [Source]: schema,
    validate: async data => {
      try {
        return {data: await schema(data)};
      } catch (error) {
        if (error instanceof Error) {
          return {issues: [new ValidationIssue(error.message)]};
        }
        throw error;
      }
    },
  }),
);
