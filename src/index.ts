import type {Schema} from './registry';

import {wrap} from './wrap';
export type {Schema} from './registry';
export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  return (await wrap(schema)).assert(data);
}
