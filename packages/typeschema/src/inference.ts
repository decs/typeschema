import type {Registry} from './registry';
import type {InferInput, InferOutput, Schema} from './resolver';
import type {IfDefined, UnknownIfNever} from './utils';

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
