import type {TypeSchemaRegistry} from './registry';
import type {IfDefined} from './utils';

export type Schema = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InferSchema<TypeSchemaRegistry[K], any>
  >;
}[keyof TypeSchemaRegistry];

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
