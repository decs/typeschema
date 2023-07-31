import type {InferInput, InferOutput} from './resolver';
import type {Schema} from './schema';
import type {IfDefined} from './utils';

export type Infer<TSchema extends Schema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferOutput<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];

export type InferIn<TSchema extends Schema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferInput<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];
