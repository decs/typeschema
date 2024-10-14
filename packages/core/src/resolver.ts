export interface Resolver<TSchema = unknown> {
  schema: TSchema;
  input: unknown;
  output: unknown;
  base: unknown;
}

export type SchemaFrom<TResolver extends Resolver> = TResolver['base'];

export type InputFrom<TResolver extends Resolver, TSchema> = (TResolver & {
  schema: TSchema;
})['input'];

export type OutputFrom<TResolver extends Resolver, TSchema> = (TResolver & {
  schema: TSchema;
})['output'];
