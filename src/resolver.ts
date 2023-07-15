export interface TypeSchemaResolver<TSchema = unknown> {
  type: unknown;
  schema: TSchema;
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
