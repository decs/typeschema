import type {Adapter, Schema} from './registry';
import type {TypeSchema} from './schema';

import './adapters';

import {adapters} from './registry';

let lastRecentUsedAdapter: Adapter | null = null;

export async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T>> {
  if (lastRecentUsedAdapter != null) {
    const result = await lastRecentUsedAdapter(schema);
    if (result != null) {
      return result;
    }
  }
  const results = (
    await Promise.all(
      adapters.map(async wrapper => ({result: await wrapper(schema), wrapper})),
    )
  ).filter(
    (
      res,
    ): res is {
      result: TypeSchema<T>;
      wrapper: Adapter;
    } => res.result !== null,
  );
  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }
  lastRecentUsedAdapter = results[0].wrapper;
  return results[0].result;
}
