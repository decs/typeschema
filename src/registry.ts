import type {
  InferInput as InferInputType,
  InferOutput as InferOutputType,
} from './resolver';
import type {TypeSchema} from './schema';
import type {IfDefined} from './utils';

export type InferInput<TSchema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferInputType<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];

export type InferOutput<TSchema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferOutputType<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];

export type RegistryBaseSchema<
  Key extends keyof TypeSchemaRegistry = keyof TypeSchemaRegistry,
> = TypeSchemaRegistry[Key]['base'];

export type Adapter = <Schema extends RegistryBaseSchema>(
  schema: Schema,
) => Promise<TypeSchema<Schema> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <Schema extends RegistryBaseSchema<TKey>>(
    schema: Schema,
  ) => Promise<Schema | null>,
  wrap: <TSchema extends RegistryBaseSchema<TKey>>(
    schema: TSchema,
  ) => TypeSchema<TSchema>,
) {
  adapters.push(async schema => {
    const coercedSchema = await coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  });
}

import './adapters';
