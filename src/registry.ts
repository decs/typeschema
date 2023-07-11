import type {InferSchema} from './resolver';

export type Schema<T> = {
  [K in keyof TypeSchemaRegistry]: InferSchema<TypeSchemaRegistry[K], T>;
}[keyof TypeSchemaRegistry];

export type WrappedSchema<T> = {
  assert(data: unknown): Promise<T>;
};

export type Wrapper = <T>(
  schema: Schema<T>,
) => Promise<WrappedSchema<T> | null>;

export const adapters: Array<Wrapper> = [];

export function register(wrapper: Wrapper) {
  adapters.push(wrapper);
}
