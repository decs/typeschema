import type {Resolver, SchemaFrom} from './resolver';
import type {JSONSchema7} from 'json-schema';

import {memoizeWithKey} from './utils';

export type SerializationAdapter<TResolver extends Resolver> = <
  TSchema extends SchemaFrom<TResolver>,
>(
  schema: TSchema,
) => Promise<JSONSchema7>;

export type ToJSONSchema<TResolver extends Resolver> = <
  TSchema extends SchemaFrom<TResolver>,
>(
  schema: TSchema,
) => Promise<JSONSchema7>;

/* @__NO_SIDE_EFFECTS__ */
export function createToJSONSchema<TResolver extends Resolver>(
  serializationAdapter: SerializationAdapter<TResolver>,
): ToJSONSchema<TResolver> {
  const memoizedSerializationAdapter = memoizeWithKey(
    (schema: SchemaFrom<TResolver>) => serializationAdapter(schema),
  );
  return async schema => {
    const serializedSchema = await memoizedSerializationAdapter(schema);
    return serializedSchema;
  };
}
