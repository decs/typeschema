import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';

import {registerAdapter} from './adapter-registry';

type FunctionSchema<T = unknown> = (data: unknown) => T;

declare global {
  export interface SchemaAdapterRegistry {
    function: FunctionResolver;
  }
}
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

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  if (typeof schema !== 'function' || 'assert' in schema) {
    return null;
  }
  schema satisfies FunctionSchema<T>;
  return {
    assert: async data => schema(data),
  };
}

registerAdapter(wrap);
