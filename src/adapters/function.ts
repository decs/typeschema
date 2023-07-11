import type {TypeSchemaResolver} from '../resolver';

import {register} from '../registry';

type FunctionSchema<T = unknown> = (data: unknown) => T;

interface FunctionResolver extends TypeSchemaResolver {
  base: FunctionSchema<this['type']>;
  input: this['schema'] extends FunctionSchema
    ? ReturnType<this['schema']>
    : never;
  output: this['schema'] extends FunctionSchema
    ? ReturnType<this['schema']>
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
    assert: async data => schema(data),
  }),
);
