import type {Infer} from './api/inference';
import type {Schema, TypeSchema} from './api/schema';
import type {Adapter} from './registry';

import {adapters} from './registry';

export const cachedWrappedSchemas = new Map<Schema, TypeSchema>();

let lastUsedAdapter: Adapter | null = null;

export function wrapCached<TSchema extends Schema>(
  schema: TSchema,
): TypeSchema<Infer<TSchema>> | null {
  return cachedWrappedSchemas.get(schema) as TypeSchema<Infer<TSchema>> | null;
}

export async function wrap<TSchema extends Schema>(
  schema: TSchema,
): Promise<TypeSchema<Infer<TSchema>>> {
  if (lastUsedAdapter != null) {
    const wrappedSchema = await lastUsedAdapter(schema);
    if (wrappedSchema != null) {
      cachedWrappedSchemas.set(schema, wrappedSchema);
      return wrappedSchema;
    }
  }

  const results = await Promise.all(
    adapters.map(async adapter => ({
      adapter,
      wrappedSchema: await adapter(schema),
    })),
  );
  const filteredResults = results.filter(
    result => result.wrappedSchema != null,
  ) as Array<{
    adapter: Adapter;
    wrappedSchema: TypeSchema<Infer<TSchema>>;
  }>;

  if (filteredResults.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (filteredResults.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }

  lastUsedAdapter = filteredResults[0].adapter;
  cachedWrappedSchemas.set(schema, filteredResults[0].wrappedSchema);
  return filteredResults[0].wrappedSchema;
}
