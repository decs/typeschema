import type {Schema} from './registry';

import {wrap} from './wrap';

export type {Schema} from './registry';
export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  const wrappedSchema = await wrap(schema);
  const result = await wrappedSchema.validate(data);
  if (result.valid) {
    return result.value;
  }
  throw result.errors[0];
}
