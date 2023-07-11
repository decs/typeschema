import type {InferSchema, TypeSchemaResolver} from './resolver';
import type {TypeSchema} from './schema';

export type Schema<T> = {
  [K in keyof TypeSchemaRegistry]: InferSchema<TypeSchemaRegistry[K], T>;
}[keyof TypeSchemaRegistry];

export type Adapter = <T>(schema: Schema<T>) => Promise<TypeSchema<T> | null>;

export const adapters: Array<Adapter> = [];

export function register<TResolver extends TypeSchemaResolver>(
  coerce: <T>(schema: Schema<T>) => Promise<InferSchema<TResolver, T> | null>,
  wrap: <T>(schema: InferSchema<TResolver, T>) => TypeSchema<T>,
) {
  adapters.push(async <T>(schema: Schema<T>) => {
    const coercedSchema = await coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  });
}
