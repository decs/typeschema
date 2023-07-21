export interface TypeSchemaResolver<TSchema = unknown> {
  type: unknown;
  schema: TSchema;
  input: unknown;
  output: unknown;
  base: unknown;
}

export type InferInput<
  TResolver extends TypeSchemaResolver,
  TSchema,
> = (TResolver & {schema: TSchema})['input'];

export type InferOutput<
  TResolver extends TypeSchemaResolver,
  TSchema,
> = (TResolver & {schema: TSchema})['output'];

export type InferSchema<
  TResolver extends TypeSchemaResolver,
  T,
> = (TResolver & {type: T})['base'];
