import type {Registry} from './registry.ts';
import type {InferInput, InferOutput, Schema} from './resolver.ts';
import type {IfDefined, UnknownIfNever} from './utils.ts';

export type Infer<TSchema extends Schema> = UnknownIfNever<
  {
    [K in keyof Registry]: IfDefined<InferOutput<Registry[K], TSchema>>;
  }[keyof Registry]
>;

export type InferIn<TSchema extends Schema> = UnknownIfNever<
  {
    [K in keyof Registry]: IfDefined<InferInput<Registry[K], TSchema>>;
  }[keyof Registry]
>;
