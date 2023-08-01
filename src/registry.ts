import type {Infer} from './inference';
import type {InferSchema} from './resolver';
import type {Schema, TypeSchema} from './schema';

import {maybe} from './utils';

export type Adapter = <TSchema extends Schema>(
  schema: TSchema,
) => Promise<TypeSchema<Infer<TSchema>> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <TSchema extends Schema>(
    schema: TSchema,
  ) => InferSchema<TypeSchemaRegistry[TKey], Infer<TSchema>> | null,
  wrap: <T>(
    schema: InferSchema<TypeSchemaRegistry[TKey], T>,
  ) => Promise<TypeSchema<T>>,
  module?: string,
) {
  adapters.push(async schema => {
    if (module != null) {
      const result = await maybe(() => import(module));
      if (result == null) {
        return null;
      }
    }
    const coercedSchema = coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  });
}
