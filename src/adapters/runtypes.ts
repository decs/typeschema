import type {Schema, WrappedSchema} from '.';
import type {Runtype} from 'runtypes';

import {maybe} from '../utils';

export type AdapterSchema<T> = Runtype<T>;

export async function wrap<T>(
  schema: Schema<T>,
): Promise<WrappedSchema<T> | null> {
  const Runtypes = await maybe(() => import('runtypes'));
  if (Runtypes == null) {
    return null;
  }
  if (!('reflect' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies AdapterSchema<T>;
  return {
    assert: async data => schema.check(data),
  };
}
