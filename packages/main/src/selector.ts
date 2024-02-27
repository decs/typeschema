import type {AdapterResolverMap} from './adapters';
import type {AdapterResolver} from './resolver';
import type {Kind} from '@sinclair/typebox';
import type {SchemaFrom} from '@typeschema/core';
import type {validatorSymbol} from 'ow/dist/predicates/predicate';

function isTypeboxSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolverMap['typebox']> {
  return typeof schema === 'object' && Symbol.for('TypeBox.Kind') in schema;
}

function isClassValidatorSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolverMap['classValidator']> {
  return /^\s*class[^\w]+/.test(schema.toString());
}

function notJSON<TSchema>(
  schema: TSchema,
): Exclude<TSchema, SchemaFrom<AdapterResolverMap['json']>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
}

export type Select<TSchema> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSchema extends Function
    ? TSchema extends {assert: unknown}
      ? 'arktype'
      : TSchema extends new (...args: unknown[]) => object
        ? 'classValidator'
        : 'function'
    : TSchema extends {[Kind]: unknown}
      ? 'typebox'
      : TSchema extends {__isYupSchema__: unknown}
        ? 'yup'
        : TSchema extends {_def: unknown}
          ? 'zod'
          : TSchema extends {async: unknown}
            ? 'valibot'
            : TSchema extends {refiner: unknown}
              ? 'superstruct'
              : TSchema extends {_flags: unknown}
                ? 'joi'
                : TSchema extends {encode: unknown}
                  ? 'ioTs'
                  : TSchema extends {reflect: unknown}
                    ? 'runtypes'
                    : TSchema extends {ast: unknown}
                      ? 'effect'
                      : TSchema extends {kind: unknown}
                        ? 'deepkit'
                        : TSchema extends {[validatorSymbol]: unknown}
                          ? 'ow'
                          : 'json';

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
