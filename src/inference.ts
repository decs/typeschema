import type {TypeSchemaRegistry} from './adapters';
import type {InferInput, InferOutput, Schema} from './resolver';
import type {IfDefined, UnknownIfNever} from './utils';

export type Infer<TSchema extends Schema> = UnknownIfNever<
  {
    [K in keyof TypeSchemaRegistry]: IfDefined<
      InferOutput<TypeSchemaRegistry[K], TSchema>
    >;
  }[keyof TypeSchemaRegistry]
>;

export type InferIn<TSchema extends Schema> = UnknownIfNever<
  {
    [K in keyof TypeSchemaRegistry]: IfDefined<
      InferInput<TypeSchemaRegistry[K], TSchema>
    >;
  }[keyof TypeSchemaRegistry]
>;
