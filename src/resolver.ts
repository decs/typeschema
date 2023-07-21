export interface Resolver<TSchema = unknown> {
  type: unknown;
  schema: TSchema;
  input: unknown;
  output: unknown;
  base: unknown;
}

export type InferInput<TResolver extends Resolver, TSchema> = (TResolver & {
  schema: TSchema;
})['input'];

export type InferOutput<TResolver extends Resolver, TSchema> = (TResolver & {
  schema: TSchema;
})['output'];

export type InferSchema<TResolver extends Resolver, T> = (TResolver & {
  type: T;
})['base'];
