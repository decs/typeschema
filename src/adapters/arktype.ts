import type {Schema, WrappedSchema} from '.';
import type {Type} from 'arktype';

import {maybe} from '../utils';

export type AdapterSchema<T> = Type<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const ArkType = await maybe(() => import('arktype'));
  if (ArkType == null) {
    return null;
  }
  if (!('infer' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.assert(data) as T,
  };
}
