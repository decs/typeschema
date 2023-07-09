import type {Schema, WrappedSchema} from '.';
import type {Schema as YupSchema} from 'yup';

export type AdapterSchema<T> = YupSchema<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  if (!('__isYupSchema__' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.validate(data, {strict: true}),
  };
}
