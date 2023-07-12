import type {Schema} from './registry';
import type {ValidationError} from './schema';

import {wrap} from './wrap';

export type {Schema} from './registry';
export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export async function validate<T>(
  schema: Schema<T>,
  data: unknown,
): Promise<
  {valid: true; value: T} | {valid: false; errors: Array<ValidationError>}
> {
  return (await wrap(schema)).validate(data);
}

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  const result = await validate(schema, data);
  if (result.valid) {
    return result.value;
  }
  throw result.errors[0];
}
