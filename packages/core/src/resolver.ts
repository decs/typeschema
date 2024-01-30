export interface Resolver<TSchema = unknown> {
  schema: TSchema;
  input: unknown;
  output: unknown;
  base: unknown;
}

export type Schema<TResolver extends Resolver> = TResolver['base'];

export type Input<
  TResolver extends Resolver,
  TSchema extends Schema<TResolver>,
> = (TResolver & {schema: TSchema})['input'];

export type Output<
  TResolver extends Resolver,
  TSchema extends Schema<TResolver>,
> = (TResolver & {schema: TSchema})['input'];
