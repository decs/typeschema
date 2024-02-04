import type {AdapterResolver, AdapterResolverMap} from './resolver';
import type {Schema} from '@typeschema/core';

export const select: <TReturn>(is: {
  [Adapter in keyof AdapterResolverMap]: (
    schema: Schema<AdapterResolverMap[Adapter]>,
  ) => TReturn;
}) => (schema: Schema<AdapterResolver>) => TReturn = is => schema => {
  switch (typeof schema) {
    case 'function':
      return is.arktype(schema);
    case 'object':
      if ('_def' in schema) {
        return is.zod(schema);
      }
      if ('async' in schema) {
        return is.valibot(schema);
      }
      break;
  }
  schema satisfies never;
  throw Error('not supported');
};
