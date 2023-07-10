import type {Schema, WrappedSchema} from '.';
import type {AnySchema} from 'joi';

import {maybe} from '../utils';

export type AdapterSchema<T> = AnySchema<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const Joi = await maybe(() => import('joi'));
  if (Joi == null) {
    return null;
  }
  if (!('_flags' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.validateAsync(data),
  };
}
