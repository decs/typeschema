import type {Adapter, Schema} from './registry';
import type {TypeSchema} from './schema';

import {adapters} from './registry';

let lastUsedAdapter: Adapter | null = null;

export async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T>> {
  if (lastUsedAdapter != null) {
    const wrappedSchema = await lastUsedAdapter(schema);
    if (wrappedSchema != null) {
      return wrappedSchema;
    }
  }

  const results = (
    await Promise.all(
      adapters.map(async adapter => ({
        adapter,
        wrappedSchema: await adapter(schema),
      })),
    )
  ).filter(
    (
      result,
    ): result is {
      adapter: Adapter;
      wrappedSchema: TypeSchema<T>;
    } => result.wrappedSchema != null,
  );

  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }

  lastUsedAdapter = results[0].adapter;
  return results[0].wrappedSchema;
}
