import type {IfDefined} from './utils';

export interface Resolver<TSchema = unknown> {
  schema: TSchema;
  input: unknown;
  output: unknown;
  base: unknown;
}

export type SchemaFrom<TResolver extends Resolver> = IfDefined<
  TResolver['base']
>;

export type InputFrom<
  TResolver extends Resolver,
  TSchema extends SchemaFrom<TResolver>,
> = IfDefined<(TResolver & {schema: TSchema})['input']>;

export type OutputFrom<
  TResolver extends Resolver,
  TSchema extends SchemaFrom<TResolver>,
> = IfDefined<(TResolver & {schema: TSchema})['output']>;
