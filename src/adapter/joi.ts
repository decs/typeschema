import type {Schema, WrappedSchema} from '.';
import type {AnySchema} from 'joi';

export type AdapterSchema<T> = AnySchema<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  if (!('_flags' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.validateAsync(data),
  };
}
