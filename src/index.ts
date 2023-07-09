import type {Schema} from './adapters';

import {wrap} from './adapters';

export type {Schema} from './adapters';
export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  return (await wrap(schema)).assert(data);
}
