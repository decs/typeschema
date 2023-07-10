import type {Schema, WrappedSchema} from '.';
import type {Schema as YupSchema} from 'yup';

import {maybe} from '../utils';

export type AdapterSchema<T> = YupSchema<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const Yup = await maybe(() => import('yup'));
  if (Yup == null) {
    return null;
  }
  if (!('__isYupSchema__' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.validate(data, {strict: true}),
  };
}
