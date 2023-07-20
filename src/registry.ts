import type {Infer} from '.';
import type {InferSchema} from './resolver';
import type {TypeSchema} from './schema';
import type {IfDefined} from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Schema<T = any> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferSchema<TypeSchemaRegistry[K], T>
  >;
}[keyof TypeSchemaRegistry];

export type Adapter = <TSchema extends Schema>(
  schema: TSchema,
) => Promise<TypeSchema<Infer<TSchema>> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <TSchema extends Schema>(
    schema: TSchema,
  ) => Promise<InferSchema<TypeSchemaRegistry[TKey], Infer<TSchema>> | null>,
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
