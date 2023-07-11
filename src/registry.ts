import type {InferSchema, TypeSchemaResolver} from './resolver';

export type Schema<T> = {
  [K in keyof TypeSchemaRegistry]: InferSchema<TypeSchemaRegistry[K], T>;
}[keyof TypeSchemaRegistry];

export type TypeSchema<T> = {
  assert(data: unknown): Promise<T>;
};
export type Adapter = <T>(schema: Schema<T>) => Promise<TypeSchema<T> | null>;

export const adapters: Array<Adapter> = [];

export function register<TResolver extends TypeSchemaResolver>(
  coerce: <T>(schema: Schema<T>) => Promise<InferSchema<TResolver, T> | null>,
  wrap: <T>(schema: InferSchema<TResolver, T>) => TypeSchema<T>,
) {
  const adapter: Adapter = async <T>(schema: Schema<T>) => {
    const coercedSchema = await coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema) : null;
  };
  adapters.push(adapter);
}
