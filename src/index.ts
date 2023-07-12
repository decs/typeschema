import type {Schema} from './registry';
import type {TypeSchema, ValidationIssue} from './schema';

import {wrap} from './wrap';

export type {Schema} from './registry';
export type {ValidationIssue} from './schema';

export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

const cache = new Map<Schema<any>, TypeSchema<any>>();
let isCacheEnabled = true;

export function clearCache() {
  cache.clear();
}

export function setCaching(on: boolean) {
  isCacheEnabled = on;
}

export async function validate<T>(
  schema: Schema<T>,
  data: unknown,
): Promise<{data: T} | {issues: Array<ValidationIssue>}> {
  if (isCacheEnabled) {
    let wrapped = cache.get(schema);
    if (!wrapped) {
      wrapped = await wrap(schema);
      cache.set(schema, wrapped);
    }
    return wrapped.validate(data);
  }
  return (await wrap(schema)).validate(data);
}

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  const result = await validate(schema, data);
  if ('issues' in result) {
    throw result.issues[0];
  }
  return result.data;
}
