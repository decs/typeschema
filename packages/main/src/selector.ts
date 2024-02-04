import type {AdapterResolver, AdapterResolverMap} from './resolver';
import type {Schema} from '@typeschema/core';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';

export function isTypeboxSchema(
  schema: Schema<AdapterResolver>,
): schema is Schema<TypeboxResolver> {
  return Symbol.for('TypeBox.Kind') in schema;
}

export const select: <TReturn>(is: {
  [Adapter in keyof AdapterResolverMap]: (
    schema: Schema<AdapterResolverMap[Adapter]>,
  ) => TReturn;
}) => (schema: Schema<AdapterResolver>) => TReturn = is => schema => {
  switch (typeof schema) {
    case 'function':
      return is.arktype(schema);
    case 'object':
      if (isTypeboxSchema(schema)) {
        return is.typebox(schema);
      }
      if ('__isYupSchema__' in schema) {
        return is.yup(schema);
      }
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
