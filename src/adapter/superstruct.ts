import type {Schema, WrappedSchema} from '.';
import type {Struct} from 'superstruct';

export type AdapterSchema<T> = Struct<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  if (!('refiner' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.create(data),
  };
}
