import type {Schema, TypeSchema} from './registry';

import './adapters';

import {adapters} from './registry';

export async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T>> {
  const results = (
    await Promise.all(adapters.map(wrapper => wrapper(schema)))
  ).filter(Boolean) as Array<TypeSchema<T>>;
  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }
  return results[0];
}
