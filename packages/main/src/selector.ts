import type {AdapterResolver, Branch} from './resolver';
import type {Schema} from '@typeschema/core';

export const select: <TReturn>(
  is: Branch<TReturn>,
) => (schema: Schema<AdapterResolver>) => TReturn = is => schema => {
  if ('_def' in schema) {
    return is.zod(schema);
  }
  if ('async' in schema) {
    return is.valibot(schema);
  }
  schema satisfies never;
  throw Error('not supported');
};
