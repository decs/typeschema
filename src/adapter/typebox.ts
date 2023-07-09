import type {Schema, WrappedSchema} from '.';
import type {TSchema} from '@sinclair/typebox';

export type AdapterSchema<T> = TSchema & {static: T};

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  let Typebox = null;
  try {
    Typebox = await import('@sinclair/typebox');
  } catch (_e) {}
  if (Typebox == null || !(Typebox.Kind in schema)) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => {
      const {TypeCompiler} = await import('@sinclair/typebox/compiler');
      const result = TypeCompiler.Compile(schema);
      if (result.Check(data)) {
        return data;
      }
      throw new Error(JSON.stringify([...result.Errors(data)]));
    },
  };
}
