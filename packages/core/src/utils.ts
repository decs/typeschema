import type {Resolver, SchemaFrom} from './resolver';

export type IfDefined<TValue, TModule extends string = ''> = unknown extends TValue
  ? TModule extends ''
    ? never
    : `Cannot find module '${TModule}'`
  : TValue;

export type UnknownIfNever<T> = [T] extends [never] ? unknown : T;

/* @__NO_SIDE_EFFECTS__ */
export function memoize<TValue>(
  fn: () => Promise<TValue>,
): (() => Promise<TValue>) & {clear(): void} {
  let cache: TValue | undefined = undefined;
  const memoizedFn = async () => {
    if (cache === undefined) {
      cache = await fn();
    }
    return cache;
  };
  memoizedFn.clear = () => (cache = undefined);
  return memoizedFn;
}

/* @__NO_SIDE_EFFECTS__ */
export function memoizeWithKey<TKey, TValue>(
  fn: (key: TKey) => Promise<TValue>,
): ((key: TKey) => Promise<TValue>) & {clear(): void} {
  const cache = new Map<TKey, TValue>();
  const memoizedFn = async (key: TKey) => {
    if (!cache.has(key)) {
      cache.set(key, await fn(key));
    }
    return cache.get(key) as TValue;
  };
  memoizedFn.clear = () => cache.clear();
  return memoizedFn;
}

/* @__NO_SIDE_EFFECTS__ */
export function unsupportedAdapter<TResolver extends Resolver>(
  adapterName: string,
): (schema: SchemaFrom<TResolver>) => Promise<never> {
  return async () => {
    throw new Error(`This feature is unsupported for ${adapterName}`);
  };
}
