import type {Resolver, ValidationAdapter} from '@typeschema/core';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

export interface AdapterResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Input<this['schema']>
    : never;
  output: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Output<this['schema']>
    : never;
}

export const fetchModule = async () => {
  try {
    const {safeParseAsync} = await import(/* webpackIgnore: true */ 'valibot');
    return {safeParseAsync};
  } catch (error) {
    throw error;
  }
};

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {safeParseAsync} = await fetchModule();
  return async data => {
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
};
