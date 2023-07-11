import type {Schema} from '../registry';
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

register(async <T>(schema: Schema<T>) => {
  if (typeof schema !== 'function' || 'assert' in schema) {
    return null;
  }
  schema satisfies FunctionSchema<T>;
  return {
    assert: async data => schema(data),
  };
});
