import type {Registry} from './registry';
import type {IfDefined} from './utils';

export type Schema = {
  [K in keyof Registry]: IfDefined<InferSchema<Registry[K]>>;
}[keyof Registry];

export interface Resolver<TSchema = unknown> {
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

export type InferSchema<TResolver extends Resolver> = TResolver['base'];
