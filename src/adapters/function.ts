import type {Schema, WrappedSchema} from '.';

export type AdapterSchema<T> = (data: unknown) => T;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  if (typeof schema !== 'function' || 'assert' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema(data),
  };
}
