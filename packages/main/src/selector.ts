import type {AdapterResolver, AdapterResolverMap} from './resolver';
import type {AdapterResolver as ClassValidatorResolver} from '@typeschema/class-validator';
import type {SchemaFrom} from '@typeschema/core';
import type {AdapterResolver as AjvResolver} from '@typeschema/json';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';

function isTypeboxSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<TypeboxResolver> {
  return Symbol.for('TypeBox.Kind') in schema;
}

function isClassValidatorSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<ClassValidatorResolver> {
  return /^\s*class[^\w]+/.test(schema.toString());
}

function notJSON<TSchema>(
  schema: TSchema,
): Exclude<TSchema, SchemaFrom<AjvResolver>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
}

export const select: (is: {
  [Adapter in keyof AdapterResolverMap]: (
    schema: SchemaFrom<AdapterResolverMap[Adapter]>,
  ) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => (schema: SchemaFrom<AdapterResolver>) => any =
  /* @__NO_SIDE_EFFECTS__ */
  is => schema => {
    switch (typeof schema) {
      case 'function':
        if ('assert' in schema) return is.arktype(schema);
        if (isClassValidatorSchema(schema)) return is.classValidator(schema);
        return is.function(schema);
      case 'object':
        if (isTypeboxSchema(schema)) return is.typebox(schema);
        if ('__isYupSchema__' in schema) return is.yup(notJSON(schema));
        if ('_def' in schema) return is.zod(notJSON(schema));
        if ('async' in schema) return is.valibot(notJSON(schema));
        if ('refiner' in schema) return is.superstruct(notJSON(schema));
        if ('_flags' in schema) return is.joi(notJSON(schema));
        if ('encode' in schema) return is.ioTs(notJSON(schema));
        if ('reflect' in schema) return is.runtypes(notJSON(schema));
        if ('ast' in schema) return is.effect(notJSON(schema));
        if ('kind' in schema) return is.deepkit(notJSON(schema));
        if ('context' in schema) return is.ow(notJSON(schema));
        return is.json(schema);
    }
  };
