import type {Schema} from './adapter';

import {wrap} from './adapter';

export type {Schema} from './adapter';
export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  return (await wrap(schema)).assert(data);
}
