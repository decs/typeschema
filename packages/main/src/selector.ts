import type {AdapterResolvers} from './adapters';
import type {AdapterResolver} from './resolver';
import type {Kind} from '@sinclair/typebox';
import type {IfDefined, SchemaFrom} from '@typeschema/core';
import type {CoreValidator} from 'suretype';

type IsTypeboxSchema<TSchema> = [IfDefined<typeof Kind>] extends [never]
  ? false
  : TSchema extends {[Kind]: unknown}
    ? true
    : false;
function isTypeboxSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['typebox']> {
  return typeof schema === 'object' && Symbol.for('TypeBox.Kind') in schema;
}

type IsSuretypeSchema<TSchema> = [IfDefined<CoreValidator<unknown>>] extends [
  never,
]
  ? false
  : TSchema extends CoreValidator<unknown>
    ? true
    : false;
function isSuretypeSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['suretype']> {
  return typeof schema === 'object' && '_annotations' in schema;
}

type IsClassValidatorSchema<TSchema> = TSchema extends new (
  ...args: unknown[]
) => object
  ? true
  : false;
function isClassValidatorSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['classValidator']> {
  return (
    typeof schema === 'function' && /^\s*class[^\w]+/.test(schema.toString())
  );
}

function notJSON<TSchema>(
  schema: TSchema,
): Exclude<TSchema, SchemaFrom<AdapterResolvers['json']>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
}

export type Select<TSchema> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  TSchema extends Function
    ? TSchema extends {assert: unknown}
      ? 'arktype'
      : IsClassValidatorSchema<TSchema> extends true
        ? 'classValidator'
        : 'function'
    : IsTypeboxSchema<TSchema> extends true
      ? 'typebox'
      : IsSuretypeSchema<TSchema> extends true
        ? 'suretype'
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
                          : TSchema extends {addValidator: unknown}
                            ? 'ow'
                            : TSchema extends {toTerminals: unknown}
                              ? 'valita'
                              : 'json';

export const select: <
  TMap extends {
    [TModule in keyof AdapterResolvers]: (
      schema: SchemaFrom<AdapterResolvers[TModule]>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any;
  },
>(
  is: TMap,
) => <TSchema extends SchemaFrom<AdapterResolver>>(
  schema: TSchema,
) => ReturnType<TMap[Select<TSchema>]> =
  /* @__NO_SIDE_EFFECTS__ */
  is => schema => {
    switch (typeof schema) {
      case 'function':
        if ('assert' in schema) return is.arktype(schema);
        if (isClassValidatorSchema(schema)) return is.classValidator(schema);
        return is.function(schema);
      case 'object':
        if (isTypeboxSchema(schema)) return is.typebox(schema);
        if (isSuretypeSchema(schema)) return is.suretype(schema);
        if ('__isYupSchema__' in schema) return is.yup(notJSON(schema));
        if ('_def' in schema) return is.zod(notJSON(schema));
        if ('async' in schema) return is.valibot(notJSON(schema));
        if ('refiner' in schema) return is.superstruct(notJSON(schema));
        if ('_flags' in schema) return is.joi(notJSON(schema));
        if ('encode' in schema) return is.ioTs(notJSON(schema));
        if ('reflect' in schema) return is.runtypes(notJSON(schema));
        if ('ast' in schema) return is.effect(notJSON(schema));
        if ('kind' in schema) return is.deepkit(notJSON(schema));
        if ('addValidator' in schema) return is.ow(notJSON(schema));
        if ('toTerminals' in schema) return is.valita(notJSON(schema));
        return is.json(schema);
    }
  };
