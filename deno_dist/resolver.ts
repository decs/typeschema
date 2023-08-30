import type {Registry} from './registry.ts';
import type {IfDefined} from './utils.ts';

export type Schema = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof Registry]: IfDefined<InferSchema<Registry[K], any>>;
}[keyof Registry];

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
