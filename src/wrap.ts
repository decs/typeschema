import type {Adapter} from './registry';
import type {TypeSchema} from './schema';

import {adapters} from './registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cachedWrappedSchemas = new Map<any, TypeSchema<any>>();

let lastUsedAdapter: Adapter | null = null;

export function wrapCached<TSchema>(
  schema: TSchema,
): TypeSchema<TSchema> | null {
  return cachedWrappedSchemas.get(schema) as TypeSchema<TSchema> | null;
}

export async function wrap<
  TSchema extends TypeSchemaRegistry[keyof TypeSchemaRegistry]['base'],
>(schema: TSchema): Promise<TypeSchema<TSchema>> {
  if (lastUsedAdapter != null) {
    const wrappedSchema = await lastUsedAdapter(schema);
    if (wrappedSchema != null) {
      cachedWrappedSchemas.set(schema, wrappedSchema);
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
      wrappedSchema: TypeSchema<TSchema>;
    } => result.wrappedSchema != null,
  );

  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }

  lastUsedAdapter = results[0].adapter;
  cachedWrappedSchemas.set(schema, results[0].wrappedSchema);
  return results[0].wrappedSchema;
}
