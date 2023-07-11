import type {InferSchema} from './resolver';

export type Schema<T> = {
  [K in keyof TypeSchemaRegistry]: InferSchema<TypeSchemaRegistry[K], T>;
}[keyof TypeSchemaRegistry];

export type TypeSchema<T> = {
  assert(data: unknown): Promise<T>;
};
export type Adapter = <T>(schema: Schema<T>) => Promise<TypeSchema<T> | null>;

export const adapters: Array<Adapter> = [];

export function register(adapter: Adapter) {
  adapters.push(adapter);
}
