import type {JSONSchema, Resolver, Schema} from './resolver';

import {memoizeWithKey} from './utils';

export type SerializationAdapter<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => Promise<JSONSchema<TResolver>>;

export type ToJSONSchema<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => Promise<JSONSchema<TResolver>>;

export function createToJSONSchema<TResolver extends Resolver>(
  serializationAdapter: SerializationAdapter<TResolver>,
): ToJSONSchema<TResolver> {
  const memoizedSerializationAdapter = memoizeWithKey(
    (schema: Schema<TResolver>) => serializationAdapter(schema),
  );
  return async schema => {
    const serializedSchema = await memoizedSerializationAdapter(schema);
    return serializedSchema;
  };
}
