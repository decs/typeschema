import * as ArkTypeAdapter from './arktype';
import * as FunctionAdapter from './function';
import * as JoiAdapter from './joi';
import * as RuntypesAdapter from './runtypes';
import * as SuperstructAdapter from './superstruct';
import * as TypeboxAdapter from './typebox';
import * as YupAdapter from './yup';
import * as ZodAdapter from './zod';

export type Schema<T> =
  | IfDefined<ArkTypeAdapter.AdapterSchema<T>>
  | IfDefined<FunctionAdapter.AdapterSchema<T>>
  | IfDefined<JoiAdapter.AdapterSchema<T>>
  | IfDefined<RuntypesAdapter.AdapterSchema<T>>
  | IfDefined<SuperstructAdapter.AdapterSchema<T>>
  | IfDefined<TypeboxAdapter.AdapterSchema<T>>
  | IfDefined<YupAdapter.AdapterSchema<T>>
  | IfDefined<ZodAdapter.AdapterSchema<T>>;

const adapters = [
  ArkTypeAdapter,
  FunctionAdapter,
  JoiAdapter,
  RuntypesAdapter,
  SuperstructAdapter,
  TypeboxAdapter,
  YupAdapter,
  ZodAdapter,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IfDefined<T> = any extends T ? never : T;

export type WrappedSchema<T> = {
  assert(data: unknown): Promise<T>;
};

export async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T>> {
  const results = (
    await Promise.all(adapters.map(async adapter => adapter.wrap(schema)))
  ).filter(Boolean) as Array<WrappedSchema<T>>;
  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }
  return results[0];
}
