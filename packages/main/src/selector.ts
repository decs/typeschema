import type {AdapterResolvers} from './adapters';
import type {AdapterResolver} from './resolver';
import type {IfDefined, SchemaFrom} from '@typeschema/core';
import type {CoreValidator} from 'suretype';

// prettier-ignore
type IsTypeboxSchema<TSchema> =
  TSchema extends {static: unknown, params: unknown[]} ? true
  : false;
function isTypeboxSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['typebox']> {
  return typeof schema === 'object' && Symbol.for('TypeBox.Kind') in schema;
}

// prettier-ignore
type IsSuretypeSchema<TSchema> =
  [IfDefined<CoreValidator<unknown>>] extends [never] ? false
  : TSchema extends CoreValidator<unknown> ? true
  : false;
function isSuretypeSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['suretype']> {
  return typeof schema === 'object' && '_annotations' in schema;
}

// prettier-ignore
type IsClassValidatorSchema<TSchema> =
  TSchema extends new (...args: unknown[]) => object ? true
  : false;
function isClassValidatorSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['classValidator']> {
  return (
    typeof schema === 'function' && /^\s*class[^\w]+/.test(schema.toString())
  );
}

// prettier-ignore
type IsEffectSchema<TSchema> =
  TSchema extends {make: unknown} ? true : false;
function isEffectSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['effect']> {
  return typeof schema === 'function' && 'make' in schema;
}

// prettier-ignore
type IsJSONSchema<TSchema> =
  TSchema extends {type: unknown} ? true
  : TSchema extends {const: unknown} ? true
  : TSchema extends {enum: unknown} ? true
  : TSchema extends {anyOf: unknown} ? true
  : TSchema extends {oneOf: unknown} ? true
  : TSchema extends {allOf: unknown} ? true
  : TSchema extends {not: unknown} ? true
  : TSchema extends {if: unknown} ? true
  : false;
function isJSONSchema(
  schema: SchemaFrom<AdapterResolver>,
): schema is SchemaFrom<AdapterResolvers['json']> {
  return (
    typeof schema === 'object' &&
    ('type' in schema ||
      'const' in schema ||
      'enum' in schema ||
      'anyOf' in schema ||
      'oneOf' in schema ||
      'allOf' in schema ||
      'not' in schema ||
      'if' in schema)
  );
}
function notJSON<TSchema>(
  schema: TSchema,
): Exclude<TSchema, SchemaFrom<AdapterResolvers['json']>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return schema as any;
}

// prettier-ignore
export type Select<TSchema> =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  TSchema extends Function
    ? TSchema extends {assert: unknown} ? 'arktype'
    : IsEffectSchema<TSchema> extends true ? 'effect'
    : IsClassValidatorSchema<TSchema> extends true ? 'classValidator'
    : 'function'
  : TSchema extends object
    ? IsTypeboxSchema<TSchema> extends true ? 'typebox'
    : IsSuretypeSchema<TSchema> extends true ? 'suretype'
    : TSchema extends {__isYupSchema__: unknown} ? 'yup'
    : TSchema extends {_def: unknown} ? 'zod'
    : TSchema extends {async: unknown} ? 'valibot'
    : TSchema extends {refiner: unknown} ? 'superstruct'
    : TSchema extends {_flags: unknown} ? 'joi'
    : TSchema extends {encode: unknown} ? 'ioTs'
    : TSchema extends {reflect: unknown} ? 'runtypes'
    : TSchema extends {kind: unknown} ? 'deepkit'
    : TSchema extends {addValidator: unknown} ? 'ow'
    : TSchema extends {toTerminals: unknown} ? 'valita'
    : TSchema extends {bail: unknown} ? 'vine'
    : IsJSONSchema<TSchema> extends true ? 'json'
    : 'fastestValidator'
  : never;

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
        if (isEffectSchema(schema)) return is.effect(schema);
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
        if ('kind' in schema) return is.deepkit(notJSON(schema));
        if ('addValidator' in schema) return is.ow(notJSON(schema));
        if ('toTerminals' in schema) return is.valita(notJSON(schema));
        if ('bail' in schema) return is.vine(notJSON(schema));
        if (isJSONSchema(schema)) return is.json(schema);
        return is.fastestValidator(schema);
    }
  };
