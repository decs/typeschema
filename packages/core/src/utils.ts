// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IfDefined<T> = any extends T ? never : T;

export type UnknownIfNever<T> = [T] extends [never] ? unknown : T;

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

export function unsupportedAdapter(adapterName: string): () => Promise<void> {
  return async () => {
    throw new Error(`This feature is unsupported for ${adapterName}`);
  };
}
