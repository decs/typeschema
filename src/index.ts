import type {Schema} from './registry';
import type {ValidationIssue} from './schema';

import {wrap, wrapCached} from './wrap';

export type {Schema} from './registry';
export type {ValidationIssue} from './schema';

export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function validate<T>(
  schema: Schema<T>,
  data: unknown,
): Promise<{data: T} | {issues: Array<ValidationIssue>}> {
  const wrappedSchema = wrapCached(schema) ?? (await wrap(schema));
  return wrappedSchema.validate(data);
}

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  const result = await validate(schema, data);
  if ('issues' in result) {
    throw result.issues[0];
  }
  return result.data;
}
