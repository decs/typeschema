// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IfDefined<T> = any extends T ? never : T;

export async function maybe<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (_e) {
    return undefined;
  }
}
