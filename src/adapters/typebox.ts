import type {Schema, WrappedSchema} from '.';
import type {TSchema} from '@sinclair/typebox';

import {maybe} from '../utils';

export type AdapterSchema<T> = TSchema & {static: T};

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const Typebox = await maybe(() => import('@sinclair/typebox'));
  if (Typebox == null) {
    return null;
  }
  if (!(Typebox.Kind in schema)) {
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
