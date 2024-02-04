import type {AdapterResolver, AdapterResolverMap} from './resolver';
import type {AdapterResolver as AjvResolver} from '@typeschema/ajv';
import type {Schema} from '@typeschema/core';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';

function isTypeboxSchema(
  schema: Schema<AdapterResolver>,
): schema is Schema<TypeboxResolver> {
  return Symbol.for('TypeBox.Kind') in schema;
}

function notJSON<TSchema>(
  schema: TSchema,
): Exclude<TSchema, Schema<AjvResolver>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
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
      if (isTypeboxSchema(schema)) return is.typebox(schema);
      if ('__isYupSchema__' in schema) return is.yup(notJSON(schema));
      if ('_def' in schema) return is.zod(notJSON(schema));
      if ('async' in schema) return is.valibot(notJSON(schema));
      if ('refiner' in schema) return is.superstruct(notJSON(schema));
      if ('_flags' in schema) return is.joi(notJSON(schema));
      if ('encode' in schema) return is.ioTs(notJSON(schema));
      return is.ajv(schema);
  }
};
