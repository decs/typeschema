import type {
  InferInput as InferInputType,
  InferOutput as InferOutputType,
} from './resolver';
import type {TypeSchema} from './schema';
import type {IfDefined} from './utils';

// export type Schema<T> = {
//   [K in keyof TypeSchemaRegistry]: IfDefined<
//     InferSchema<TypeSchemaRegistry[K], T>
//   >;
// }[keyof TypeSchemaRegistry];

export type InferInput<TSchema> = {
  [K in keyof TypeSchemaRegistry]: InferInputType<
    TypeSchemaRegistry[K],
    TSchema
  >;
}[keyof TypeSchemaRegistry];

export type InferOutput<TSchema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferOutputType<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];

export type Adapter = <
  Schema extends TypeSchemaRegistry[keyof TypeSchemaRegistry]['base'],
>(
  schema: Schema,
) => Promise<TypeSchema<Schema> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <Schema extends TypeSchemaRegistry[TKey]['base']>(
    schema: Schema,
  ) => Promise<Schema | null>,
  wrap: <TSchema extends TypeSchemaRegistry[TKey]['base']>(
    schema: TSchema,
  ) => TypeSchema<TSchema>,
) {
  adapters.push(async schema => {
    const coercedSchema = await coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  });
}

import './adapters';
