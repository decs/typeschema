import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';

export interface ValibotResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Input<this['schema']>
    : never;
  output: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Output<this['schema']>
    : never;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  try {
    const {safeParseAsync} = await import(/* webpackIgnore: true */ 'valibot');
    return {safeParseAsync};
  } catch (error) {
    throw error;
  }
});

const coerce: Coerce<'valibot'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'async' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {safeParseAsync} = await fetchModule();
  return async (data: unknown): Promise<ValidationResult> => {
    const result = await safeParseAsync(schema, data);
    if (result.success) {
      return {
        data: result.output,
        success: true,
      };
    }
    return {
      issues: result.issues.map(({message, path}) => ({
        message,
        path: path?.map(({type, key}) =>
          type === 'map' || type === 'unknown' ? String(key) : key,
        ),
      })),
      success: false,
    };
  };
});
