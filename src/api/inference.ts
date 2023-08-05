import type {InferInput, InferOutput} from '../resolver';
import type {IfDefined, UnknownIfNever} from '../utils';
import type {Schema} from './schema';

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
