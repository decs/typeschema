import type {SchemaBaseType} from './type-resolver';

export type Schema<T> = {
  [K in keyof SchemaAdapterRegistry]: SchemaBaseType<
    SchemaAdapterRegistry[K],
    T
  >;
}[keyof SchemaAdapterRegistry];

export type WrappedSchema<T> = {
  assert(data: unknown): Promise<T>;
};

export type Wrapper = <T>(
  schema: Schema<T>,
) => Promise<WrappedSchema<T> | null>;

export const adapters: Wrapper[] = [];

export function registerAdapter(wrapper: Wrapper) {
  adapters.push(wrapper);
}
