import type {InferSchema} from './resolver';
import type {TypeSchema} from './schema';
import type {IfDefined} from './utils';

export type Schema<T> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferSchema<TypeSchemaRegistry[K], T>
  >;
}[keyof TypeSchemaRegistry];

export type Adapter = <T>(schema: Schema<T>) => Promise<TypeSchema<T> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <T>(
    schema: Schema<T>,
  ) => Promise<InferSchema<TypeSchemaRegistry[TKey], T> | null>,
  wrap: <T>(
    schema: InferSchema<TypeSchemaRegistry[TKey], T>,
  ) => Promise<TypeSchema<T>>,
) {
  adapters.push(async schema => {
    const coercedSchema = await coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  });
}

import './adapters';
