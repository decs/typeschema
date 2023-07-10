import type {Schema, WrappedSchema} from '.';
import type {ZodSchema} from 'zod';

import {maybe} from '../utils';

export type AdapterSchema<T> = ZodSchema<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const Zod = await maybe(() => import('zod'));
  if (Zod == null) {
    return null;
  }
  if (!('_def' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.parse(data),
  };
}
