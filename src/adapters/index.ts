import type {Infer} from '../inference';
import type {Registry} from '../registry';
import type {InferSchema, Schema} from '../resolver';
import type {ValidationIssue} from '../validation';

import {memoizeWithKey} from '../utils';

export type Coerce<TKey extends keyof Registry> = <
  TSchema extends Schema,
  TReturn,
>(
  adapter: (schema: InferSchema<Registry[TKey], Infer<TSchema>>) => TReturn,
) => (schema: TSchema) => TReturn | undefined;

export type CreateValidate = <TSchema extends Schema>(
  schema: TSchema,
) =>
  | Promise<
      (
        data: unknown,
      ) => Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}>
    >
  | undefined;

const wrappedAdapters: Array<{clear(): void}> = [];

export function wrap<TSchema extends Schema, TReturn>(
  adapters: Array<(schema: TSchema) => Promise<TReturn> | undefined>,
): (schema: TSchema) => Promise<TReturn> {
  const memoizedAdapter = memoizeWithKey(async (schema: TSchema) => {
    const results = await Promise.all(
      adapters
        .map(adapter => adapter(schema))
        .filter(Boolean) as Array<TReturn>,
    );
    if (results.length === 0) {
      throw new Error('Missing adapters for schema: ' + schema);
    }
    if (results.length > 1) {
      throw new Error('Conflicting adapters for schema: ' + schema);
    }
    return results[0];
  });
  wrappedAdapters.push(memoizedAdapter);
  return memoizedAdapter;
}

export function resetAdapters(): void {
  wrappedAdapters.forEach(adapter => adapter.clear());
}
