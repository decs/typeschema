import type {Schema, WrappedSchema} from './adapter-registry';

import './arktype';
import './typebox';
import './runtypes';
import './function';
import './joi';
import './superstruct';
import './yup';
import './zod';

import {adapters} from './adapter-registry';

export async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T>> {
  const results = (
    await Promise.all(adapters.map(wrapper => wrapper(schema)))
  ).filter(Boolean) as Array<WrappedSchema<T>>;
  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }
  return results[0];
}

export type {Schema};
