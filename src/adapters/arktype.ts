import type {Schema, WrappedSchema} from '.';
import type {Type} from 'arktype';

export type AdapterSchema<T> = Type<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  if (!('infer' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.assert(data) as T,
  };
}
