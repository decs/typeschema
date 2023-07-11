export interface TypeSchemaResolver<Schema = unknown> {
  type: unknown;
  schema: Schema;
  input: unknown;
  output: unknown;
  error: unknown;
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

export type InferError<TResolver extends TypeSchemaResolver> =
  TResolver['error'];

export type InferSchema<
  TResolver extends TypeSchemaResolver,
  T,
> = (TResolver & {type: T})['base'];
