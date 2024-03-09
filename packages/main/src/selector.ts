import type {AdapterResolvers} from './adapters';
import type {AdapterResolver} from './resolver';
import type {Kind} from '@sinclair/typebox';
import type {IfDefined, SchemaFrom, Selector} from '@typeschema/core';
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

interface SchemaSelector
  extends Selector<{
    [TModule in keyof AdapterResolvers]: SchemaFrom<AdapterResolvers[TModule]>;
  }> {
  // prettier-ignore
  kind:
    // eslint-disable-next-line @typescript-eslint/ban-types
    this['value'] extends Function
      ? this['value'] extends {assert: unknown} ? 'arktype'
      : IsClassValidatorSchema<this['value']> extends true ? 'classValidator'
      : 'function'
    : this['value'] extends object
      ? IsTypeboxSchema<this['value']> extends true ? 'typebox'
      : IsSuretypeSchema<this['value']> extends true ? 'suretype'
      : this['value'] extends {__isYupSchema__: unknown} ? 'yup'
      : this['value'] extends {_def: unknown} ? 'zod'
      : this['value'] extends {async: unknown} ? 'valibot'
      : this['value'] extends {refiner: unknown} ? 'superstruct'
      : this['value'] extends {_flags: unknown} ? 'joi'
      : this['value'] extends {encode: unknown} ? 'ioTs'
      : this['value'] extends {reflect: unknown} ? 'runtypes'
      : this['value'] extends {ast: unknown} ? 'effect'
      : this['value'] extends {kind: unknown} ? 'deepkit'
      : this['value'] extends {addValidator: unknown} ? 'ow'
      : this['value'] extends {toTerminals: unknown} ? 'valita'
      : 'json'
    : never;
}
export type SchemaKind<T> = (SchemaSelector & {value: T})['kind'];

export const select: SchemaSelector['fn'] =
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
